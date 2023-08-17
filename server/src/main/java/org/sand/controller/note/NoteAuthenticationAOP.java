package org.sand.controller.note;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.Signature;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.sand.common.ConstDefine.AccessEnum;
import org.sand.common.ConstDefine.ErrorCodeEnum;
import org.sand.common.ConstDefine.NoteProjectOpennessEnum;
import org.sand.common.ResultException;
import org.sand.model.dto.note.*;
import org.sand.model.dto.user.UserDTO;
import org.sand.model.po.common.BasicTablePO;
import org.sand.model.po.note.NoteFolderPO;
import org.sand.model.po.note.NotePO;
import org.sand.model.po.note.NoteProjectPO;
import org.sand.model.po.user.AccessPO;
import org.sand.service.note.*;
import org.sand.service.user.AccessService;
import org.sand.service.user.RoleService;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

@Component
@Aspect
@AllArgsConstructor
@Slf4j
public class NoteAuthenticationAOP {

    private final NoteProjectService noteProjectService;

    private final NoteProjectOwnerService noteProjectOwnerService;

    private final NoteProjectReaderService noteProjectReaderService;

    private final NoteService noteService;

    private final NoteFolderService noteFolderService;

    private final AccessService accessService;

    private final RoleService roleService;

    @Before(value = "@annotation(org.sand.controller.note.NoteAuthorization)")
    public void authorization(JoinPoint joinPoint) throws Exception, ResultException {
        // 获取请求参数
        Object[] args = joinPoint.getArgs();

        Signature signature = joinPoint.getSignature();
        // 获取方法签名
        MethodSignature methodSignature = (MethodSignature) signature;
        // 获取Method对象
        Method method = methodSignature.getMethod();

        // 获取认证信息
        Authentication authentication = null;
        for (Object arg : args) {
            if (arg instanceof Authentication) {
                authentication = (Authentication) arg;
                break;
            }
        }
        if (authentication == null) {
            log.error("missing arg \"authentication\" in method " + method.getName());
            throw new Exception("missing arg \"authentication\" in method " + method.getName());
        }

        UserDTO userDTO = (UserDTO) authentication.getPrincipal();
        if (userDTO == null) {
            throw ResultException.of(ErrorCodeEnum.INSUFFICIENT_PERMISSIONS);
        }

        String requiredAuthType = ""; // 可取值有："edit"（编辑权限）、"read"（读取权限）
        Long projectId = null;

        // 根据不同的dto获取目标笔记项目的id
        for (Object arg : args) {
            if (arg instanceof UpdateProjectDTO) {

                requiredAuthType = "edit";
                projectId = ((UpdateProjectDTO) arg).getId();
                break;

            } else if (arg instanceof DeleteProjectDTO) {

                requiredAuthType = "edit";
                projectId = ((DeleteProjectDTO) arg).getId();
                break;

            } else if (arg instanceof GetProjectDetailDTO) {

                requiredAuthType = "read";
                projectId = ((GetProjectDetailDTO) arg).getId();
                break;

            } else if (arg instanceof GetNoteTextDTO) {

                requiredAuthType = "read";
                projectId = searchProjectIdByNoteId(((GetNoteTextDTO) arg).getId());
                break;

            } else if (arg instanceof AddNoteFileDTO) {

                requiredAuthType = "edit";
                projectId = ((AddNoteFileDTO) arg).getProjectId();
                break;

            } else if (arg instanceof DeleteNoteFileDTO) {

                requiredAuthType = "edit";
                projectId = searchProjectIdByNoteId(((DeleteNoteFileDTO) arg).getId());
                break;

            } else if (arg instanceof UpdateNoteFileDTO) {

                requiredAuthType = "edit";
                projectId = searchProjectIdByNoteId(((UpdateNoteFileDTO) arg).getId());
                break;

            } else if (arg instanceof AddNoteFolderDTO) {

                requiredAuthType = "edit";
                projectId = ((AddNoteFolderDTO) arg).getProjectId();
                break;

            } else if (arg instanceof DeleteNoteFolderDTO) {

                requiredAuthType = "edit";
                projectId = searchProjectIdByNoteFolderId(((DeleteNoteFolderDTO) arg).getId());
                break;

            } else if (arg instanceof UpdateNoteFolderDTO) {

                requiredAuthType = "edit";
                projectId = searchProjectIdByNoteFolderId(((UpdateNoteFolderDTO) arg).getId());
                break;

            }
        }

        if (!verify(projectId, userDTO, requiredAuthType)) {
            throw ResultException.of(ErrorCodeEnum.INSUFFICIENT_PERMISSIONS);
        }

    }

    private Long searchProjectIdByNoteId(Long noteId) {
        NotePO notePO = noteService.getById(noteId);
        if (notePO == null) {
            return -1L;
        }
        return notePO.getProjectId();
    }

    private Long searchProjectIdByNoteFolderId(Long noteFolderId) {
        NoteFolderPO noteFolderPO = noteFolderService.getById(noteFolderId);
        if (noteFolderPO == null) {
            return -1L;
        }
        return noteFolderPO.getProjectId();
    }

    public boolean verify(Long projectId, UserDTO userDTO, String requiredAuthType) {
        NoteProjectPO noteProjectPO = noteProjectService.getById(projectId);
        if (noteProjectPO == null) {
            return false;
        }

        Long requiredAccessId = null;
        if (userDTO != null && Objects.equals(requiredAuthType, "edit")) {
            // 编辑笔记的权限判断
            Long[] ownerIds = noteProjectOwnerService.listOwnerIdsByProjectId(projectId);
            boolean ownerFlag = Stream.of(ownerIds).anyMatch(ownerId -> ownerId.equals(userDTO.getId()));

            if (ownerFlag) {
                requiredAccessId = AccessEnum.EDIT_OWNED_PROJECT.getId();
            } else {
                requiredAccessId = AccessEnum.EDIT_ALL_PROJECT.getId();
            }
        } else {
            // 读取笔记的权限判断
            Integer openness = noteProjectPO.getOpenness();

            if (Objects.equals(openness, NoteProjectOpennessEnum.FULL_PUBLIC.getValue())) {
                // 完全公开的笔记无需权限
                requiredAccessId = null;
            } else if (userDTO != null && Objects.equals(openness, NoteProjectOpennessEnum.HALF_PUBLIC.getValue())) {
                // 部分公开的笔记需要是读者或所有者才能查看
                Long[] ownerIds = noteProjectOwnerService.listOwnerIdsByProjectId(projectId);
                boolean ownerFlag = Stream.of(ownerIds).anyMatch(ownerId -> ownerId.equals(userDTO.getId()));

                Long[] readerIds = noteProjectReaderService.listReaderIdsByProjectId(projectId);
                boolean readerFlag = Stream.of(readerIds).anyMatch(readerId -> readerId.equals(userDTO.getId()));

                if (ownerFlag || readerFlag) {
                    requiredAccessId = AccessEnum.READ_OWNED_PROJECT.getId(); // 读者和所有者所需的权限都划分至该权限中，可以进行细分
                } else {
                    requiredAccessId = AccessEnum.READ_ALL_PROJECT.getId();
                }
            } else if (userDTO != null && Objects.equals(openness, NoteProjectOpennessEnum.PRIVATE.getValue())) {
                // 私有的笔记需要所有者才能查看
                Long[] ownerIds = noteProjectOwnerService.listOwnerIdsByProjectId(projectId);
                boolean ownerFlag = Stream.of(ownerIds).anyMatch(ownerId -> ownerId.equals(userDTO.getId()));

                if (ownerFlag) {
                    requiredAccessId = AccessEnum.READ_OWNED_PROJECT.getId();
                } else {
                    requiredAccessId = AccessEnum.READ_ALL_PROJECT.getId();
                }
            } else {
                return false;
            }
        }

        if (requiredAccessId == null) {
            return true;
        };

        AccessPO requiredAccessPO = accessService.getById(requiredAccessId);
        if (requiredAccessPO == null) {
            return true;
        }

        List<Long> requiredRoleIds = roleService.listRolesByAccessId(requiredAccessPO.getId()).stream().map(BasicTablePO::getId).toList();
        return userDTO.getRoleList().stream().anyMatch(rolePO -> requiredRoleIds.contains(rolePO.getId()));
    }
}

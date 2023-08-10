package org.sand.controller.note;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.Signature;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.sand.common.ConstDefine.ErrorCodeEnum;
import org.sand.common.ResultException;
import org.sand.model.dto.note.*;
import org.sand.model.dto.user.UserDTO;
import org.sand.model.po.common.BasicTablePO;
import org.sand.model.po.note.NoteFolderPO;
import org.sand.model.po.note.NotePO;
import org.sand.model.po.note.NoteProjectPO;
import org.sand.model.po.user.AccessPO;
import org.sand.service.note.NoteFolderService;
import org.sand.service.note.NoteProjectService;
import org.sand.service.note.NoteService;
import org.sand.service.user.AccessService;
import org.sand.service.user.RoleService;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.util.List;
import java.util.Objects;

@Component
@Aspect
@AllArgsConstructor
@Slf4j
public class NoteAuthenticationAOP {

    private final NoteProjectService noteProjectService;

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

        AccessPO requiredAccess = searchRequiredAccess(args, userDTO);
        if (requiredAccess == null) {
            throw ResultException.of(ErrorCodeEnum.INSUFFICIENT_PERMISSIONS);
        }

        if (!verifyAccess(requiredAccess, userDTO)) {
            throw ResultException.of(ErrorCodeEnum.INSUFFICIENT_PERMISSIONS);
        }

    }

    private long searchProjectIdByNoteId(long noteId) {
        NotePO notePO = noteService.getById(noteId);
        if (notePO == null) {
            return -1;
        }
        return notePO.getProjectId();
    }

    private long searchProjectIdByNoteFolderId(long noteFolderId) {
        NoteFolderPO noteFolderPO = noteFolderService.getById(noteFolderId);
        if (noteFolderPO == null) {
            return -1;
        }
        return noteFolderPO.getProjectId();
    }

    private AccessPO searchRequiredAccess(Object[] args, UserDTO userDTO) {

        String requiredAuth = ""; // 可取值有："edit"（编辑权限）、"read"（读取权限）
        long projectId = -1;

        // 根据不同的dto获取目标笔记项目的id
        for (Object arg : args) {
            if (arg instanceof UpdateProjectDTO) {

                requiredAuth = "edit";
                projectId = ((UpdateProjectDTO) arg).getId();
                break;

            } else if (arg instanceof DeleteProjectDTO) {

                requiredAuth = "edit";
                projectId = ((DeleteProjectDTO) arg).getId();
                break;

            } else if (arg instanceof GetProjectDetailDTO) {

                requiredAuth = "read";
                projectId = ((GetProjectDetailDTO) arg).getId();
                break;

            } else if (arg instanceof GetNoteTextDTO) {

                requiredAuth = "read";
                projectId = searchProjectIdByNoteId(((GetNoteTextDTO) arg).getId());
                break;

            } else if (arg instanceof AddNoteFileDTO) {

                requiredAuth = "edit";
                projectId = ((AddNoteFileDTO) arg).getProjectId();
                break;

            } else if (arg instanceof DeleteNoteFileDTO) {

                requiredAuth = "edit";
                projectId = searchProjectIdByNoteId(((DeleteNoteFileDTO) arg).getId());
                break;

            } else if (arg instanceof UpdateNoteFileDTO) {

                requiredAuth = "edit";
                projectId = searchProjectIdByNoteId(((UpdateNoteFileDTO) arg).getId());
                break;

            } else if (arg instanceof AddNoteFolderDTO) {

                requiredAuth = "edit";
                projectId = ((AddNoteFolderDTO) arg).getProjectId();
                break;

            } else if (arg instanceof DeleteNoteFolderDTO) {

                requiredAuth = "edit";
                projectId = searchProjectIdByNoteFolderId(((DeleteNoteFolderDTO) arg).getId());
                break;

            } else if (arg instanceof UpdateNoteFolderDTO) {

                requiredAuth = "edit";
                projectId = searchProjectIdByNoteFolderId(((UpdateNoteFolderDTO) arg).getId());
                break;

            }
        }

        NoteProjectPO noteProjectPO = noteProjectService.getById(projectId);
        if (noteProjectPO == null) {
            return null;
        }

        long accessId;
        if (Objects.equals(userDTO.getId(), noteProjectPO.getCreateUserId())) {
            // 是所有者
            if (Objects.equals(requiredAuth, "edit")) {
                accessId = 1L;
            } else if (Objects.equals(requiredAuth, "read")) {
                accessId = 3L;
            } else {
                return null;
            }
        } else {
            // 不是所有者
            if (Objects.equals(requiredAuth, "edit")) {
                accessId = 2L;
            } else if (Objects.equals(requiredAuth, "read")) {
                accessId = 4L;
            } else {
                return null;
            }
        }
        return accessService.getById(accessId);
    }

    private boolean verifyAccess(AccessPO requireAccessPO, UserDTO userDTO) {
        List<Long> requireRoleIds = roleService.listRolesByAccessId(requireAccessPO.getId()).stream().map(BasicTablePO::getId).toList();
        return userDTO.getRoleList().stream().anyMatch(rolePO -> requireRoleIds.contains(rolePO.getId()));
    }
}

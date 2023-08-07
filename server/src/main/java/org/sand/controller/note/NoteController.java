package org.sand.controller.note;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.AllArgsConstructor;
import org.sand.common.ConstDefine.ErrorCodeEnum;
import org.sand.common.ResponseVO;
import org.sand.common.ResultException;
import org.sand.model.dto.note.*;
import org.sand.model.po.note.NoteFolderPO;
import org.sand.model.po.note.NotePO;
import org.sand.model.po.note.NoteProjectPO;
import org.sand.model.po.user.UserPO;
import org.sand.model.vo.note.*;
import org.sand.service.note.NoteFolderService;
import org.sand.service.note.NoteProjectService;
import org.sand.service.note.NoteService;
import org.sand.service.user.UserService;
import org.sand.util.DBUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@Api(tags = "学习笔记模块")
@AllArgsConstructor
@RestController
@RequestMapping(value = "${project.baseUrl}/note")
public class NoteController {

    private final NoteProjectService noteProjectService;

    private final NoteService noteService;

    private final NoteFolderService noteFolderService;

    private final UserService userService;

    private final DBUtils dbUtils;

    // todo 适配查询条件
    @ApiOperation("列出符合查询条件的笔记项目")
    @PostMapping("/listProjects")
    private ResponseVO<?> listProjects() {
        List<NoteProjectPO> noteProjectPOs = noteProjectService.list();

        ListProjectsVO listProjectsVO = new ListProjectsVO();

        listProjectsVO.setNoteProjects(noteProjectPOs.stream().map((noteProjectPO) -> {
            NoteProjectVO noteProjectVO = new NoteProjectVO();
            BeanUtils.copyProperties(noteProjectPO, noteProjectVO);

            UserPO userPO = userService.getById(noteProjectPO.getCreateUserId());
            if (userPO != null) {
                noteProjectVO.setCreateUserName(userPO.getUserName());
            }

            return noteProjectVO;
        }).collect(Collectors.toList()));

        return ResponseVO.success(listProjectsVO);
    }

    @ApiOperation("更新指定笔记项目的基本信息")
    @PostMapping("/updateProject")
    private ResponseVO<?> updateProject(@Validated @RequestBody UpdateProjectDTO dto, Principal principal) {
        NoteProjectPO noteProjectPO = noteProjectService.getById(dto.getId());
        if (noteProjectPO == null) {
            return ResponseVO.error(ResultException.of(ErrorCodeEnum.MODEL_NOT_FOUND));
        }

        BeanUtils.copyProperties(dto, noteProjectPO);
        dbUtils.updateUpdateInfo(noteProjectPO, principal);

        noteProjectService.updateById(noteProjectPO);
        return ResponseVO.success();
    }

    @ApiOperation("新建一个空的笔记项目")
    @PostMapping("/addProject")
    private ResponseVO<?> addProject(@Validated @RequestBody AddProjectDTO addProjectDTO, Principal principal) {
        NoteProjectPO noteProjectPO = new NoteProjectPO();

        BeanUtils.copyProperties(addProjectDTO, noteProjectPO);
        dbUtils.updateCreateInfo(noteProjectPO, principal);

        noteProjectService.save(noteProjectPO);

        AddProjectVO addProjectVO = new AddProjectVO();
        addProjectVO.setId(noteProjectPO.getId());

        return ResponseVO.success(addProjectVO);
    }

    @ApiOperation("删除指定笔记模块")
    @PostMapping("/deleteProject")
    private ResponseVO<?> deleteProject(@Validated @RequestBody DeleteProjectDTO deleteProjectDTO) {
        if (!noteProjectService.removeById(deleteProjectDTO.getId())) {
            return ResponseVO.error(ResultException.of(ErrorCodeEnum.MODEL_DELETE_FAILED));
        }

        return ResponseVO.success();
    }

    @ApiOperation("获取指定笔记项目内部的笔记信息")
    @PostMapping("/getProjectDetail")
    private ResponseVO<?> getProjectDetail(@Validated @RequestBody GetProjectDetailDTO getProjectDetailDTO) {
        Long id = getProjectDetailDTO.getId();

        // 获取笔记项目内的笔记
        LambdaQueryWrapper<NotePO> lqw = new LambdaQueryWrapper<>();
        lqw.eq(NotePO::getProjectId, id);
        List<NotePO> notePOs = noteService.list(lqw);

        // 获取笔记项目内的笔记文件夹
        LambdaQueryWrapper<NoteFolderPO> lqw2 = new LambdaQueryWrapper<>();
        lqw2.eq(NoteFolderPO::getProjectId, id);
        List<NoteFolderPO> noteFolderPOs = noteFolderService.list(lqw2);

        GetProjectDetailVO vo = new GetProjectDetailVO();

        vo.setNotes(notePOs.stream().map((notePO) -> {
            NoteVO noteVO = new NoteVO();
            BeanUtils.copyProperties(notePO, noteVO);
            return noteVO;
        }).collect(Collectors.toList()));

        vo.setNoteFolders(noteFolderPOs.stream().map((noteFolderPO) -> {
            NoteFolderVO noteFolderVO = new NoteFolderVO();
            BeanUtils.copyProperties(noteFolderPO, noteFolderVO);
            return noteFolderVO;
        }).collect(Collectors.toList()));

        NoteProjectPO noteProjectPO = noteProjectService.getById(id);
        vo.setProjectName(noteProjectPO.getProjectName());

        return ResponseVO.success(vo);

    }

    @ApiOperation("获取指定笔记的信息")
    @PostMapping("/getNoteText")
    private ResponseVO<?> getNoteText(@Validated @RequestBody GetNoteTextDTO dto) {
        GetNoteTextVO getNoteTextVO = new GetNoteTextVO();

        try {
            getNoteTextVO.setText(noteService.getNoteText(dto.getId()));
        } catch (IOException e) {
            return ResponseVO.error(ResultException.of(ErrorCodeEnum.FTP_CONNECT_FAILED));
        }

        return ResponseVO.success(getNoteTextVO);
    }

    @ApiOperation("在笔记项目中新建文件")
    @PostMapping("/addNoteFile")
    private ResponseVO<?> addNoteFile(@Validated @RequestBody AddNoteFileDTO dto, Principal principal) {
        try {
            NotePO notePO = noteService.create();

            BeanUtils.copyProperties(dto, notePO);
            dbUtils.updateCreateInfo(notePO, principal);

            noteService.save(notePO);
        } catch (IOException e) {
            return ResponseVO.error(ResultException.of(ErrorCodeEnum.FTP_CREATE_FILE_FAILED));
        }

        return ResponseVO.success();
    }

    @ApiOperation("在笔记项目中删除文件")
    @PostMapping("/deleteNoteFile")
    private ResponseVO<?> deleteNoteFile(@Validated @RequestBody DeleteNoteFileDTO dto) {
        if (!noteService.removeById(dto.getId())) {
            return ResponseVO.error(ResultException.of(ErrorCodeEnum.MODEL_DELETE_FAILED));
        }

        return ResponseVO.success();
    }

    @ApiOperation("在笔记项目中更新文件")
    @PostMapping("/updateNoteFile")
    private ResponseVO<?> updateNoteFile(@Validated @RequestBody UpdateNoteFileDTO dto, Principal principal) {
        NotePO notePO = noteService.getById(dto.getId());
        if (notePO == null) {
            return ResponseVO.error(ResultException.of(ErrorCodeEnum.MODEL_NOT_FOUND));
        }

        BeanUtils.copyProperties(dto, notePO, "text");
        dbUtils.updateUpdateInfo(notePO, principal);

        if (!noteService.updateById(notePO)) {
            return ResponseVO.error(ResultException.of(ErrorCodeEnum.MODEL_UPDATE_FAILED));
        }

        if (dto.getText() != null) {
            try {
                noteService.setNoteText(dto.getId(), dto.getText());
            } catch (IOException e) {
                return ResponseVO.error(ResultException.of(ErrorCodeEnum.MODEL_UPDATE_FAILED));
            }
        }

        return ResponseVO.success();
    }

    @ApiOperation("在笔记项目中新建文件夹")
    @PostMapping("/addNoteFolder")
    private ResponseVO<?> addNoteFolder(@Validated @RequestBody AddNoteFolderDTO dto, Principal principal) {
        NoteFolderPO noteFolderPO = new NoteFolderPO();

        BeanUtils.copyProperties(dto, noteFolderPO);
        dbUtils.updateCreateInfo(noteFolderPO, principal);

        if (!noteFolderService.save(noteFolderPO)) {
            return ResponseVO.error(ResultException.of(ErrorCodeEnum.MODEL_ADD_FAILED));
        }

        return ResponseVO.success();
    }

    @ApiOperation("在笔记项目中删除文件夹")
    @PostMapping("/deleteNoteFolder")
    private ResponseVO<?> deleteNoteFolder(@Validated @RequestBody DeleteNoteFolderDTO dto) {
        if (!noteFolderService.removeById(dto.getId())) {
            return ResponseVO.error(ResultException.of(ErrorCodeEnum.MODEL_DELETE_FAILED));
        }

        return ResponseVO.success();
    }

    @ApiOperation("在笔记项目中更新文件夹")
    @PostMapping("/updateNoteFolder")
    private ResponseVO<?> updateNoteFolder(@Validated @RequestBody UpdateNoteFolderDTO dto, Principal principal) {
        NoteFolderPO noteFolderPO = noteFolderService.getById(dto.getId());
        if (noteFolderPO == null) {
            return ResponseVO.error(ResultException.of(ErrorCodeEnum.MODEL_NOT_FOUND));
        }

        BeanUtils.copyProperties(dto, noteFolderPO);
        dbUtils.updateUpdateInfo(noteFolderPO, principal);

        if (!noteFolderService.updateById(noteFolderPO)) {
            return ResponseVO.error(ResultException.of(ErrorCodeEnum.MODEL_UPDATE_FAILED));
        }

        return ResponseVO.success();
    }
}

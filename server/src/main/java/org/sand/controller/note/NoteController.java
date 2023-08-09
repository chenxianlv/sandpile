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
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Api(tags = "学习笔记模块")
@AllArgsConstructor
@RestController
@RequestMapping(value = "${project.baseUrl}/note")
public class NoteController {

    public final NoteProjectService noteProjectService;

    public final NoteService noteService;

    public final NoteFolderService noteFolderService;

    public final UserService userService;

    public final DBUtils dbUtils;

    // todo 适配查询条件
    @ApiOperation("列出符合查询条件的笔记项目")
    @PostMapping("/listProjects")
    public ResponseVO<?> listProjects() {
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
    @NoteAuthorization
    public ResponseVO<?> updateProject(@Validated @RequestBody UpdateProjectDTO dto, Authentication authentication) throws ResultException {
        NoteProjectPO noteProjectPO = noteProjectService.getById(dto.getId());
        if (noteProjectPO == null) {
            throw ResultException.of(ErrorCodeEnum.MODEL_NOT_FOUND);
        }

        BeanUtils.copyProperties(dto, noteProjectPO);
        dbUtils.updateUpdateInfo(noteProjectPO, authentication);

        noteProjectService.updateById(noteProjectPO);
        return ResponseVO.success();
    }

    @ApiOperation("新建一个空的笔记项目")
    @PostMapping("/addProject")
    public ResponseVO<?> addProject(@Validated @RequestBody AddProjectDTO addProjectDTO, Authentication authentication) {
        NoteProjectPO noteProjectPO = new NoteProjectPO();

        BeanUtils.copyProperties(addProjectDTO, noteProjectPO);
        dbUtils.updateCreateInfo(noteProjectPO, authentication);

        noteProjectService.save(noteProjectPO);

        AddProjectVO addProjectVO = new AddProjectVO();
        addProjectVO.setId(noteProjectPO.getId());

        return ResponseVO.success(addProjectVO);
    }

    @ApiOperation("删除指定笔记模块")
    @PostMapping("/deleteProject")
    @NoteAuthorization
    public ResponseVO<?> deleteProject(@Validated @RequestBody DeleteProjectDTO deleteProjectDTO, Authentication authentication) throws ResultException {
        if (!noteProjectService.removeById(deleteProjectDTO.getId())) {
            throw ResultException.of(ErrorCodeEnum.MODEL_DELETE_FAILED);
        }

        return ResponseVO.success();
    }

    @ApiOperation("获取指定笔记项目内部的笔记信息")
    @PostMapping("/getProjectDetail")
    @NoteAuthorization
    public ResponseVO<?> getProjectDetail(@Validated @RequestBody GetProjectDetailDTO getProjectDetailDTO, Authentication authentication) {
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
    @NoteAuthorization
    public ResponseVO<?> getNoteText(@Validated @RequestBody GetNoteTextDTO dto, Authentication authentication) throws ResultException {
        GetNoteTextVO getNoteTextVO = new GetNoteTextVO();

        try {
            getNoteTextVO.setText(noteService.getNoteText(dto.getId()));
        } catch (IOException e) {
            throw ResultException.of(ErrorCodeEnum.FTP_CONNECT_FAILED);
        }

        return ResponseVO.success(getNoteTextVO);
    }

    @ApiOperation("在笔记项目中新建文件")
    @PostMapping("/addNoteFile")
    @NoteAuthorization
    public ResponseVO<?> addNoteFile(@Validated @RequestBody AddNoteFileDTO dto, Authentication authentication) throws ResultException {
        try {
            NotePO notePO = noteService.create();

            BeanUtils.copyProperties(dto, notePO);
            dbUtils.updateCreateInfo(notePO, authentication);

            noteService.save(notePO);
        } catch (IOException e) {
            throw ResultException.of(ErrorCodeEnum.FTP_CREATE_FILE_FAILED);
        }

        return ResponseVO.success();
    }

    @ApiOperation("在笔记项目中删除文件")
    @PostMapping("/deleteNoteFile")
    @NoteAuthorization
    public ResponseVO<?> deleteNoteFile(@Validated @RequestBody DeleteNoteFileDTO dto, Authentication authentication) throws ResultException {
        if (!noteService.removeById(dto.getId())) {
            throw ResultException.of(ErrorCodeEnum.MODEL_DELETE_FAILED);
        }

        return ResponseVO.success();
    }

    @ApiOperation("在笔记项目中更新文件")
    @PostMapping("/updateNoteFile")
    @NoteAuthorization
    public ResponseVO<?> updateNoteFile(@Validated @RequestBody UpdateNoteFileDTO dto, Authentication authentication) throws ResultException {
        NotePO notePO = noteService.getById(dto.getId());
        if (notePO == null) {
            throw ResultException.of(ErrorCodeEnum.MODEL_NOT_FOUND);
        }

        BeanUtils.copyProperties(dto, notePO, "text");
        dbUtils.updateUpdateInfo(notePO, authentication);

        if (!noteService.updateById(notePO)) {
            throw ResultException.of(ErrorCodeEnum.MODEL_UPDATE_FAILED);
        }

        if (dto.getText() != null) {
            try {
                noteService.setNoteText(dto.getId(), dto.getText());
            } catch (IOException e) {
                throw ResultException.of(ErrorCodeEnum.MODEL_UPDATE_FAILED);
            }
        }

        return ResponseVO.success();
    }

    @ApiOperation("在笔记项目中新建文件夹")
    @PostMapping("/addNoteFolder")
    @NoteAuthorization
    public ResponseVO<?> addNoteFolder(@Validated @RequestBody AddNoteFolderDTO dto, Authentication authentication) throws ResultException {
        NoteFolderPO noteFolderPO = new NoteFolderPO();

        BeanUtils.copyProperties(dto, noteFolderPO);
        dbUtils.updateCreateInfo(noteFolderPO, authentication);

        if (!noteFolderService.save(noteFolderPO)) {
            throw ResultException.of(ErrorCodeEnum.MODEL_ADD_FAILED);
        }

        return ResponseVO.success();
    }

    @ApiOperation("在笔记项目中删除文件夹")
    @PostMapping("/deleteNoteFolder")
    @NoteAuthorization
    public ResponseVO<?> deleteNoteFolder(@Validated @RequestBody DeleteNoteFolderDTO dto, Authentication authentication) throws ResultException {
        if (!noteFolderService.removeById(dto.getId())) {
            throw ResultException.of(ErrorCodeEnum.MODEL_DELETE_FAILED);
        }

        return ResponseVO.success();
    }

    @ApiOperation("在笔记项目中更新文件夹")
    @PostMapping("/updateNoteFolder")
    @NoteAuthorization
    public ResponseVO<?> updateNoteFolder(@Validated @RequestBody UpdateNoteFolderDTO dto, Authentication authentication) throws ResultException {
        NoteFolderPO noteFolderPO = noteFolderService.getById(dto.getId());
        if (noteFolderPO == null) {
            throw ResultException.of(ErrorCodeEnum.MODEL_NOT_FOUND);
        }

        BeanUtils.copyProperties(dto, noteFolderPO);
        dbUtils.updateUpdateInfo(noteFolderPO, authentication);

        if (!noteFolderService.updateById(noteFolderPO)) {
            throw ResultException.of(ErrorCodeEnum.MODEL_UPDATE_FAILED);
        }

        return ResponseVO.success();
    }
}

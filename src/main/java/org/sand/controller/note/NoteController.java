package org.sand.controller.note;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.AllArgsConstructor;
import org.sand.common.ResponseVO;
import org.sand.model.dto.note.NoteProjectAddDTO;
import org.sand.model.dto.note.NoteProjectDeleteDTO;
import org.sand.model.dto.note.NoteProjectUpdateDTO;
import org.sand.model.po.note.NoteFolderPO;
import org.sand.model.po.note.NotePO;
import org.sand.model.po.note.NoteProjectPO;
import org.sand.model.po.user.UserPO;
import org.sand.model.vo.note.*;
import org.sand.service.note.NoteFolderService;
import org.sand.service.note.NoteProjectService;
import org.sand.service.note.NoteService;
import org.sand.service.user.UserService;
import org.springframework.beans.BeanUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@Api(tags = "学习笔记模块")
@RestController
@AllArgsConstructor
@RequestMapping(value = "${project.baseUrl}/note")
public class NoteController {

    private final NoteProjectService noteProjectService;

    private final NoteService noteService;

    private final NoteFolderService noteFolderService;

    private final UserService userService;

    // todo 适配查询条件
    @ApiOperation("列出符合查询条件的笔记项目")
    @GetMapping("/listProjects")
    private ResponseVO<NoteProjectListVO> listProjects() {
        List<NoteProjectPO> noteProjectPOs = noteProjectService.list();

        NoteProjectListVO noteProjectListVO = new NoteProjectListVO();

        noteProjectListVO.setNoteProjects(noteProjectPOs.stream().map((noteProjectPO) -> {
            NoteProjectVO noteProjectVO = new NoteProjectVO();
            BeanUtils.copyProperties(noteProjectPO, noteProjectVO);

            UserPO userPO = userService.getById(noteProjectPO.getCreateUserId());
            if (userPO != null) {
                noteProjectVO.setCreateUserName(userPO.getUserName());
            }

            return noteProjectVO;
        }).collect(Collectors.toList()));

        return ResponseVO.success(noteProjectListVO);
    }

    @ApiOperation("更新指定笔记项目的基本信息")
    @PutMapping("/updateProject")
    private Object updateProjectInfo(@Validated @RequestBody NoteProjectUpdateDTO noteProjectUpdateDTO) {

        NoteProjectPO noteProjectPO = new NoteProjectPO();
        BeanUtils.copyProperties(noteProjectUpdateDTO, noteProjectPO);

        noteProjectService.updateById(noteProjectPO);
        return ResponseVO.success();

    }

    @ApiOperation("新建一个空的笔记项目")
    @PostMapping("/addProject")
    private Object addProject(@Validated @RequestBody NoteProjectAddDTO noteProjectAddDTO, Principal principal) {

        NoteProjectPO noteProjectPO = new NoteProjectPO();
        BeanUtils.copyProperties(noteProjectAddDTO, noteProjectPO);

        if (principal != null) {
            UserPO userPO = userService.getByUserAccount(principal.getName());
            noteProjectPO.setCreateUserId(userPO.getId());
        } else {
            noteProjectPO.setCreateUserId(0L);
        }

        noteProjectService.save(noteProjectPO);

        NoteProjectAddVO noteProjectAddVO = new NoteProjectAddVO();
        noteProjectAddVO.setId(noteProjectPO.getId());

        return ResponseVO.success(noteProjectAddVO);

    }

    @ApiOperation("删除指定笔记模块")
    @DeleteMapping("/deleteProject")
    private Object deleteProject(@Validated NoteProjectDeleteDTO noteProjectDeleteDTO) {
        noteProjectService.removeById(noteProjectDeleteDTO.getId());
        return ResponseVO.success();
    }

    @ApiOperation("获取指定笔记项目内部的笔记信息")
    @GetMapping("/getProjectDetail")
    private ResponseVO<NoteProjectDetailVO> getProjectDetail(@RequestParam("id") Integer projectId) {

        // 获取笔记项目内的笔记
        LambdaQueryWrapper<NotePO> lqw = new LambdaQueryWrapper<>();
        lqw.eq(NotePO::getProjectId, projectId);
        List<NotePO> notePOs = noteService.list(lqw);

        // 获取笔记项目内的笔记文件夹
        LambdaQueryWrapper<NoteFolderPO> lqw2 = new LambdaQueryWrapper<>();
        lqw2.eq(NoteFolderPO::getProjectId, projectId);
        List<NoteFolderPO> noteFolderPOs  = noteFolderService.list(lqw2);

        NoteProjectDetailVO vo = new NoteProjectDetailVO();

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

        NoteProjectPO noteProjectPO = noteProjectService.getById(projectId);
        vo.setProjectName(noteProjectPO.getProjectName());

        return ResponseVO.success(vo);

    }

    @ApiOperation("获取指定笔记的信息")
    @GetMapping("/getNoteInfo")
    private ResponseVO<NoteDetailVO> getNoteDetail(@RequestParam Long id) {
        NoteDetailVO noteDetailVO = new NoteDetailVO();
        try {
            noteDetailVO.setText(noteService.getNoteText(id));
        } catch (IOException e) {
            return ResponseVO.error(50000, "FTP连接失败");
        }
        return ResponseVO.success(noteDetailVO);
    }

}

package org.sand.controller.note;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.sand.common.ResponseDTO;
import org.sand.model.dto.note.NoteProjectDTO;
import org.sand.model.po.note.NotePO;
import org.sand.model.po.note.NoteProjectPO;
import org.sand.model.po.user.UserPO;
import org.sand.model.vo.note.*;
import org.sand.service.note.NoteProjectService;
import org.sand.service.note.NoteService;
import org.sand.service.user.UserService;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Api(tags = "学习笔记模块")
@RestController
@RequestMapping(value = "/api/note")
public class NoteController {

    private final NoteProjectService noteProjectService;

    private final NoteService noteService;

    private final UserService userService;

    public NoteController(NoteProjectService noteProjectService, NoteService noteService, UserService userService) {
        this.noteProjectService = noteProjectService;
        this.noteService = noteService;
        this.userService = userService;
    }

    // todo 适配查询条件
    @ApiOperation("列出符合查询条件的笔记项目")
    @GetMapping("/project/list")
    private ResponseDTO<NoteProjectListVO> listProjects() {
        List<NoteProjectPO> noteProjectPOs = noteProjectService.list();

        NoteProjectListVO noteProjectListVO = new NoteProjectListVO();

        noteProjectListVO.setNoteProjects(noteProjectPOs.stream().map((noteProjectPO)->{
            NoteProjectVO noteProjectVO = new NoteProjectVO();
            BeanUtils.copyProperties(noteProjectPO, noteProjectVO);

            UserPO userPO = userService.getById(noteProjectPO.getCreateUserId());
            noteProjectVO.setCreateUserName(userPO.getUserName());

            return noteProjectVO;
        }).collect(Collectors.toList()));

        return ResponseDTO.success(noteProjectListVO);
    }

    @ApiOperation("获取指定笔记项目内部的笔记信息")
    @GetMapping("/project")
    private ResponseDTO<NoteProjectDetailVO> getProjectDetail(@RequestParam("id") Integer projectId) {

        // 获取笔记项目内的笔记
        LambdaQueryWrapper<NotePO> lqw = new LambdaQueryWrapper<>();
        lqw.eq(NotePO::getProjectId, projectId);
        List<NotePO> notePOs = noteService.list(lqw);

        NoteProjectDetailVO vo = new NoteProjectDetailVO();
        vo.setNotes(notePOs.stream().map((notePO)->{
            NoteVO noteVO = new NoteVO();
            BeanUtils.copyProperties(notePO, noteVO);
            return noteVO;
        }).collect(Collectors.toList()));

        NoteProjectPO noteProjectPO = noteProjectService.getById(projectId);
        vo.setProjectName(noteProjectPO.getProjectName());

        return ResponseDTO.success(vo);

    }

    @ApiOperation("更新指定笔记模块信息")
    @PutMapping("/project")
    private Object updateProjectInfo(@RequestBody NoteProjectDTO noteProjectDTO) {

        NoteProjectPO noteProjectPO = new NoteProjectPO();
        BeanUtils.copyProperties(noteProjectDTO, noteProjectPO);

        noteProjectService.updateById(noteProjectPO);
        return ResponseDTO.success();

    }

//    @ApiOperation("删除指定笔记模块")
//    @DeleteMapping
//    private Object deleteProject() {
//        LoginDTO loginDto = new LoginDTO();
//        loginDto.setUserName("chen");
//        return loginDto;
//    }
    @ApiOperation("获取指定笔记的信息")
    @GetMapping("/note")
    private ResponseDTO<NoteDetailVO> getNoteDetail(@RequestParam Long id) {
        NoteDetailVO noteDetailVO = new NoteDetailVO();
        try {
            noteDetailVO.setText(noteService.getNoteText(id));
        } catch (IOException e) {
            return ResponseDTO.error(50000, "FTP连接失败");
        }
        return ResponseDTO.success(noteDetailVO);
    }

}

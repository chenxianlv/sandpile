package org.sand.controller.note;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.sand.common.ResponseDTO;
import org.sand.model.dto.note.NoteProjectDTO;
import org.sand.model.po.note.NotePO;
import org.sand.model.po.note.NoteProjectPO;
import org.sand.model.vo.note.NoteProjectDetailVO;
import org.sand.model.vo.note.NoteProjectVO;
import org.sand.service.note.NoteProjectService;
import org.sand.service.note.NoteService;
import org.sand.utils.BeanCopyUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Api(tags = "学习笔记模块")
@RestController
@RequestMapping(value = "/api/note/project")
public class NoteController {

    private final NoteProjectService noteProjectService;

    private final NoteService noteService;

    public NoteController(NoteProjectService noteProjectService, NoteService noteService) {
        this.noteProjectService = noteProjectService;
        this.noteService = noteService;
    }

    // todo 适配查询条件
    @ApiOperation("列出符合查询条件的笔记项目")
    @GetMapping("/list")
    private ResponseDTO<NoteProjectVO> listProjects() {
        List<NoteProjectPO> noteProjectPOs = noteProjectService.list();

        NoteProjectVO noteProjectVO = new NoteProjectVO();
        noteProjectVO.setNoteProjects(BeanCopyUtils.copyListProperties(noteProjectPOs, NoteProjectPO::new));

        return ResponseDTO.success(noteProjectVO);
    }

    @ApiOperation("获取指定笔记项目内部的笔记信息")
    @GetMapping("/detail")
    private ResponseDTO<NoteProjectDetailVO> getProjectDetail(@RequestParam("id") Integer projectId) {

        // 获取笔记项目内的笔记
        LambdaQueryWrapper<NotePO> lqw = new LambdaQueryWrapper<>();
        lqw.eq(NotePO::getProjectId, projectId);
        List<NotePO> notePOs = noteService.list(lqw);

        NoteProjectDetailVO vo = new NoteProjectDetailVO();
        vo.setNotes(BeanCopyUtils.copyListProperties(notePOs, NotePO::new, "url", "projectId"));

        return ResponseDTO.success(vo);

    }

    @ApiOperation("更新指定笔记模块信息")
    @PutMapping
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

}

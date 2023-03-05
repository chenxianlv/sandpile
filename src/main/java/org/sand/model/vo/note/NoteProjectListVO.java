package org.sand.model.vo.note;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

@Data
public class NoteProjectListVO {

    @ApiModelProperty("笔记项目列表")
    private List<NoteProjectVO> noteProjects;

}

package org.sand.model.vo.note;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

@Data
public class ListProjectsVO {

    @ApiModelProperty("笔记项目列表")
    private List<NoteProjectVO> noteProjects;

}

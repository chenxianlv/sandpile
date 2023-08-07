package org.sand.model.vo.note;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.sand.model.vo.common.BasicVO;

import java.util.List;

@Data
public class ListProjectsVO extends BasicVO {

    @ApiModelProperty("笔记项目列表")
    private List<NoteProjectVO> noteProjects;

}

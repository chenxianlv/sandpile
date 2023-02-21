package org.sand.model.vo.note;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.sand.model.po.note.NoteProjectPO;

import java.util.List;

@Data
public class NoteProjectVO {

    @ApiModelProperty("笔记项目列表")
    private List<NoteProjectPO> noteProjects;

}

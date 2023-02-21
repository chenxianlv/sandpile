package org.sand.model.po.note;

import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@TableName("note_project_info")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NoteProjectPO {

    private Integer id;

    private String projectName;

}

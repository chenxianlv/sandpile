package org.sand.model.po.note;

import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.Date;

@Data
@TableName("note_project_info")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NoteProjectPO {

    private Long id;

    private String projectName;

    private Long createUserId;

    private Date createTime;

}

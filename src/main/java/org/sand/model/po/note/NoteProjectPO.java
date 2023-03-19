package org.sand.model.po.note;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.Date;

@Data
@TableName("note_project_info")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NoteProjectPO {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String projectName;

    @TableLogic
    private Boolean deleteFlag;

    private Date createTime;

    private Long createUserId;

    private Data updateTime;

    private Long updateUserId;

    private String remark;
}

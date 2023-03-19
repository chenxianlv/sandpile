package org.sand.model.po.note;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.Date;

@Data
@TableName("note_info")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NotePO {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;

    private String filePath;

    @TableField("directory_path")
    private String path;

    private Long projectId;

    @TableLogic
    private Boolean deleteFlag;

    private Date createTime;

    private Long createUserId;

    private Data updateTime;

    private Long updateUserId;

    private String remark;
}

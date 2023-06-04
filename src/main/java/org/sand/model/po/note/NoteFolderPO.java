package org.sand.model.po.note;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.Date;

@Data
@TableName("note_folder_info")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NoteFolderPO {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;

    private Long projectId;

    private Long folderId;

    @TableLogic
    private Boolean deleteFlag;

    private Date createTime;

    private Long createUserId;

    private Data updateTime;

    private Long updateUserId;

    private String remark;
}

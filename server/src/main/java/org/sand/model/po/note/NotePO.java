package org.sand.model.po.note;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.util.Date;

@Data
@TableName("note_info")
public class NotePO {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;

    private String filePath;

    private Long folderId;

    private Long projectId;

    @TableLogic
    private Boolean deleteFlag;

    private Date createTime;

    private Long createUserId;

    private Data updateTime;

    private Long updateUserId;

    private String remark;
}

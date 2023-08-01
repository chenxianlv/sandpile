package org.sand.model.po.user;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.util.Date;
import java.util.List;

@TableName("user_role")
@Data
public class RolePO {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String roleName;

    @TableField(exist = false)
    private List<AccessPO> accessList;

    @TableLogic
    private Boolean deleteFlag;

    private Date createTime;

    private Long createUserId;

    private Data updateTime;

    private Long updateUserId;

    private String remark;
}

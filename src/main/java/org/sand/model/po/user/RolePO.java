package org.sand.model.po.user;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.util.List;

@TableName("user_role")
@Data
public class RolePO {

    @TableId("id")
    private Long id;

    private String roleName;

    @TableField(exist = false)
    private List<AccessPO> accessList;

}

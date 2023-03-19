package org.sand.model.po.user;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@TableName("user_user_role")
@Data
public class UserRolePO {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;

    private Long roleId;

}

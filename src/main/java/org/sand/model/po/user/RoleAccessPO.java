package org.sand.model.po.user;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("user_role_access")
public class RoleAccessPO {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long roleId;

    private Long AccessId;

}

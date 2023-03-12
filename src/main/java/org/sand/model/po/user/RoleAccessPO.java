package org.sand.model.po.user;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("user_role_access")
public class RoleAccessPO {

    @TableId("id")
    private Long id;

    private Long roleId;

    private Long AccessId;

}

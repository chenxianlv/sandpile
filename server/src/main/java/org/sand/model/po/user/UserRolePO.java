package org.sand.model.po.user;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import org.sand.model.po.common.IntermediateTablePO;

@TableName("user_user_role")
@Data
public class UserRolePO extends IntermediateTablePO {

    private Long userId;

    private Long roleId;

}

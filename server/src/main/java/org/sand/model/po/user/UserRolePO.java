package org.sand.model.po.user;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import org.sand.model.po.common.IntermediateTablePO;

@Data
@TableName("user_user_role")
public class UserRolePO extends IntermediateTablePO {

    private Long userId;

    private Long roleId;

}

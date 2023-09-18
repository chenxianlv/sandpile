package org.sand.model.po.user;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import org.sand.model.po.common.IntermediateTablePO;

@Data
@TableName("user_role_access")
public class RoleAccessPO extends IntermediateTablePO {

    private Long roleId;

    private Long accessId;

}

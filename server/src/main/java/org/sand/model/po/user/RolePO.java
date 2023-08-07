package org.sand.model.po.user;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import org.sand.model.po.common.BasicTablePO;

import java.util.List;

@TableName("user_role")
@Data
public class RolePO extends BasicTablePO {

    private String roleName;

    @TableField(exist = false)
    private List<AccessPO> accessList;

}

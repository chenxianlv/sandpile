package org.sand.model.po.user;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import org.sand.model.po.common.BasicTablePO;

@TableName("user_user")
@Data
public class UserPO extends BasicTablePO {

    private String userAccount;

    @TableField("user_name")
    private String username;

    private String userPassword;

    private Boolean lockFlag;

}

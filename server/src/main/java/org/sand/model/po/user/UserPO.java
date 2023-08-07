package org.sand.model.po.user;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import org.sand.model.po.common.BasicTablePO;

@TableName("user_user")
@Data
public class UserPO extends BasicTablePO {

    private String userAccount;

    private String userName;

    private String userPassword;

    private Boolean lockFlag;

}

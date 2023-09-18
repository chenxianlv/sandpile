package org.sand.model.po.user;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import org.sand.model.po.common.BasicTablePO;

@TableName("user_user")
@Data
public class UserPO extends BasicTablePO {
    
    private String username;

    private String nickname;

    private String password;

    private Boolean lockFlag;

}

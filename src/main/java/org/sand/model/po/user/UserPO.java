package org.sand.model.po.user;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@TableName("user_user")
@Data
public class UserPO {

    @TableId("id")
    private Long id;

    private String userAccount;

    private String userName;

    private String userPassword;

}

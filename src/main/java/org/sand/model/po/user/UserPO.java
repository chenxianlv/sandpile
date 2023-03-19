package org.sand.model.po.user;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.util.Date;

@TableName("user_user")
@Data
public class UserPO {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String userAccount;

    private String userName;

    private String userPassword;

    private Boolean lockFlag;

    @TableLogic
    private Boolean deleteFlag;

    private Date createTime;

    private Long createUserId;

    private Data updateTime;

    private Long updateUserId;

    private String remark;

}

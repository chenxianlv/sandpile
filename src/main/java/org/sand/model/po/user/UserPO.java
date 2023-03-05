package org.sand.model.po.user;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@TableName("users")
@Data
public class UserPO {

    private Long id;

    private String name;

    private String account;

}

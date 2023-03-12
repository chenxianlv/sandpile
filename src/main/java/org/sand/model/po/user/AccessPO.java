package org.sand.model.po.user;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@TableName("user_access")
@Data
public class AccessPO {

    @TableId("id")
    private Long id;

    private String accessName;

    private String accessUrl;

}

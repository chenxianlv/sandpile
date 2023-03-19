package org.sand.model.po.user;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.util.Date;

@TableName("user_access")
@Data
public class AccessPO {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String accessName;

    private String accessUrl;

    @TableLogic
    private Boolean deleteFlag;

    private Date createTime;

    private String remark;

}

package org.sand.model.po.common;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import lombok.Data;

import java.sql.Timestamp;

@Data
public class BasicTablePO {

    @TableId(type = IdType.AUTO)
    private Long id;

    @TableLogic
    private Boolean deleteFlag;

    private Timestamp createTime;

    private Long createUserId;

    private Timestamp updateTime;

    private Long updateUserId;

    private String remark;

}

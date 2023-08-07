package org.sand.model.po.common;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

@Data
public class IntermediateTablePO {

    @TableId(type = IdType.AUTO)
    private Long id;

}

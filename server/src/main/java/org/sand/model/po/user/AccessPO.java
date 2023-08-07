package org.sand.model.po.user;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import org.sand.model.po.common.BasicTablePO;

@TableName("user_access")
@Data
public class AccessPO extends BasicTablePO {

    private String accessName;

    private String accessUrl;

}

package org.sand.model.po.note;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import org.sand.model.po.common.BasicTablePO;

@Data
@TableName("note_info")
public class NotePO extends BasicTablePO {

    private String name;

    private String filePath;

    private Long folderId;

    private Long projectId;

}

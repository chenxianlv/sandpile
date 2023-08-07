package org.sand.model.po.note;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import org.sand.model.po.common.BasicTablePO;

@Data
@TableName("note_folder_info")
public class NoteFolderPO extends BasicTablePO {

    private String name;

    private Long projectId;

    private Long folderId;

}

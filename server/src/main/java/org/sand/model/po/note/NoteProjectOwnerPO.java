package org.sand.model.po.note;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import org.sand.model.po.common.IntermediateTablePO;

@Data
@TableName("note_project_owner")
public class NoteProjectOwnerPO extends IntermediateTablePO {

    private Long projectId;

    private Long userId;

}

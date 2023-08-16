package org.sand.model.po.note;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import org.sand.model.po.common.BasicTablePO;

@Data
@TableName("note_project_info")
public class NoteProjectPO extends BasicTablePO {

    private String projectName;

    private Integer openness;

}

package org.sand.model.vo.note;

import lombok.Data;
import org.sand.model.po.note.NotePO;

import java.util.List;

@Data
public class NoteProjectDetailVO {

    private List<NotePO> notes;

}

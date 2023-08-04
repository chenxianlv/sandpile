package org.sand.service.note;

import com.baomidou.mybatisplus.extension.service.IService;
import org.sand.model.po.note.NotePO;

import java.io.IOException;

public interface NoteService extends IService<NotePO> {

    String getNoteText(Long id) throws IOException;

    void setNoteText(Long id, String text) throws IOException;

    NotePO create() throws IOException;

}

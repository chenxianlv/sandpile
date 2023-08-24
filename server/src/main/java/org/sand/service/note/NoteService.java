package org.sand.service.note;

import com.baomidou.mybatisplus.extension.service.IService;
import org.sand.model.po.note.NotePO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface NoteService extends IService<NotePO> {

    String getNoteText(Long id) throws IOException;

    void setNoteText(Long id, String text) throws IOException;

    NotePO createNote() throws IOException;

    /*
     * @return 创建的文件的filePath
     */
    String uploadNote(MultipartFile file) throws IOException;

}

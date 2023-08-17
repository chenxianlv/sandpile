package org.sand.service.note;

import com.baomidou.mybatisplus.extension.service.IService;
import org.sand.model.po.note.NoteProjectReaderPO;

import java.util.List;

public interface NoteProjectReaderService extends IService<NoteProjectReaderPO> {

    Long[] listReaderIdsByProjectId(Long projectId);
    
    boolean addReaders(Long projectId, Long[] ids);
    
    boolean deleteReaders(Long projectId, List<NoteProjectReaderPO> readerPOs);
    
    boolean updateReaders(Long projectId, Long[] newIds);

}

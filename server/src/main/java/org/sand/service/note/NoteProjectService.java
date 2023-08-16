package org.sand.service.note;

import com.baomidou.mybatisplus.extension.service.IService;
import org.sand.model.po.note.NoteProjectPO;
import org.sand.model.po.user.UserPO;

import java.util.List;

public interface NoteProjectService extends IService<NoteProjectPO> {

    List<UserPO> listOwnerByProjectId(Long projectId);

    List<UserPO> listReaderByProjectId(Long projectId);

}

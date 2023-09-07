package org.sand.service.note;

import com.baomidou.mybatisplus.extension.service.IService;
import org.sand.model.po.note.NoteFolderPO;

public interface NoteFolderService extends IService<NoteFolderPO> {

    boolean deleteFolder(Long id);

}

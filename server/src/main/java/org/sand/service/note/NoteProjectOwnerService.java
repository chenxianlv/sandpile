package org.sand.service.note;

import com.baomidou.mybatisplus.extension.service.IService;
import org.sand.model.po.note.NoteProjectOwnerPO;

import java.util.List;

public interface NoteProjectOwnerService extends IService<NoteProjectOwnerPO> {

    Long[] listOwnerIdsByProjectId(Long projectId);

    boolean addOwners(Long projectId, Long[] ids);

    boolean deleteOwners(Long projectId, List<NoteProjectOwnerPO> ownerPOs);

    boolean updateOwners(Long projectId, Long[] newIds);

}

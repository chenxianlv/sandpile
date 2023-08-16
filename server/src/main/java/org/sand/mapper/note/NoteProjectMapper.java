package org.sand.mapper.note;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.sand.model.po.note.NoteProjectPO;
import org.sand.model.po.user.UserPO;

import java.util.List;

@Mapper
public interface NoteProjectMapper extends BaseMapper<NoteProjectPO> {

    List<UserPO> listOwnerByProjectId(Long projectId);

    List<UserPO> listReaderByProjectId(Long projectId);

}

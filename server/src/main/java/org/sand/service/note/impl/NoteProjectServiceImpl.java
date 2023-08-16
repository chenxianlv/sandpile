package org.sand.service.note.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.AllArgsConstructor;
import org.sand.mapper.note.NoteProjectMapper;
import org.sand.model.po.note.NoteProjectPO;
import org.sand.model.po.user.UserPO;
import org.sand.service.note.NoteProjectService;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@AllArgsConstructor
public class NoteProjectServiceImpl extends ServiceImpl<NoteProjectMapper, NoteProjectPO> implements NoteProjectService {

    private final NoteProjectMapper noteProjectMapper;

    @Override
    public List<UserPO> listOwnerByProjectId(Long projectId) {
        return noteProjectMapper.listOwnerByProjectId(projectId);
    }

    @Override
    public List<UserPO> listReaderByProjectId(Long projectId) {
        return noteProjectMapper.listReaderByProjectId(projectId);
    }

}

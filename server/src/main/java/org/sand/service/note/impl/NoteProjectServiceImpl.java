package org.sand.service.note.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.AllArgsConstructor;
import org.sand.mapper.note.NoteProjectMapper;
import org.sand.mapper.note.NoteProjectOwnerMapper;
import org.sand.mapper.note.NoteProjectReaderMapper;
import org.sand.model.po.note.NoteProjectOwnerPO;
import org.sand.model.po.note.NoteProjectPO;
import org.sand.model.po.note.NoteProjectReaderPO;
import org.sand.service.note.NoteProjectService;
import org.springframework.stereotype.Service;


@Service
@AllArgsConstructor
public class NoteProjectServiceImpl extends ServiceImpl<NoteProjectMapper, NoteProjectPO> implements NoteProjectService {

    private final NoteProjectOwnerMapper noteProjectOwnerMapper;

    private final NoteProjectReaderMapper noteProjectReaderMapper;

    @Override
    public Long[] listOwnerIdsByProjectId(Long projectId) {
        return noteProjectOwnerMapper.selectList(
                new LambdaQueryWrapper<NoteProjectOwnerPO>().eq(NoteProjectOwnerPO::getProjectId, projectId)
        ).stream().map(NoteProjectOwnerPO::getUserId).toArray(Long[]::new);
    }

    @Override
    public Long[] listReaderIdsByProjectId(Long projectId) {
        return noteProjectReaderMapper.selectList(
                new LambdaQueryWrapper<NoteProjectReaderPO>().eq(NoteProjectReaderPO::getProjectId, projectId)
        ).stream().map(NoteProjectReaderPO::getUserId).toArray(Long[]::new);
    }


}

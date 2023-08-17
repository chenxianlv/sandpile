package org.sand.service.note.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.AllArgsConstructor;
import org.sand.mapper.note.NoteProjectReaderMapper;
import org.sand.model.po.note.NoteProjectReaderPO;
import org.sand.service.note.NoteProjectReaderService;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;


@Service
@AllArgsConstructor
public class NoteProjectReaderServiceImpl extends ServiceImpl<NoteProjectReaderMapper, NoteProjectReaderPO> implements NoteProjectReaderService {

    private final NoteProjectReaderMapper noteProjectReaderMapper;
    
    @Override
    public Long[] listReaderIdsByProjectId(Long projectId) {
        return listReadersModalByProjectId(projectId).stream().map(NoteProjectReaderPO::getUserId).toArray(Long[]::new);
    }

    private List<NoteProjectReaderPO> listReadersModalByProjectId(Long projectId) {
        return noteProjectReaderMapper.selectList(
                new LambdaQueryWrapper<NoteProjectReaderPO>().eq(NoteProjectReaderPO::getProjectId, projectId)
        );
    }
    
    @Override
    public boolean addReaders(Long projectId, Long[] ids) {
        return Arrays.stream(ids).allMatch(id -> {
            NoteProjectReaderPO po = new NoteProjectReaderPO();
            po.setProjectId(projectId);
            po.setUserId(id);
            return noteProjectReaderMapper.insert(po) == 1;
        });
    }

    @Override
    public boolean deleteReaders(Long projectId, List<NoteProjectReaderPO> readerPOs) {
        return readerPOs.stream().allMatch(readerPO -> noteProjectReaderMapper.deleteById(readerPO) == 1);
    }
    
    @Override
    public boolean updateReaders(Long projectId, Long[] newIds) {
        List<NoteProjectReaderPO> oldReaders = listReadersModalByProjectId(projectId);

        Long[] readerIdsNeedToAdd = Arrays.stream(newIds).filter(
                newReaderId -> oldReaders.stream().noneMatch(oldReader -> oldReader.getUserId().equals(newReaderId))
        ).toArray(Long[]::new);
        
        List<NoteProjectReaderPO> readerPOsNeedToDelete = oldReaders.stream().filter(
                oldReader -> Arrays.stream(newIds).noneMatch(newReaderId -> oldReader.getUserId().equals(newReaderId))
        ).toList();
        
        return addReaders(projectId, readerIdsNeedToAdd) && deleteReaders(projectId, readerPOsNeedToDelete);
    }

}

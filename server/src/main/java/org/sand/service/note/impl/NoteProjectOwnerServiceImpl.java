package org.sand.service.note.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.AllArgsConstructor;
import org.sand.mapper.note.NoteProjectOwnerMapper;
import org.sand.model.po.note.NoteProjectOwnerPO;
import org.sand.service.note.NoteProjectOwnerService;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;


@Service
@AllArgsConstructor
public class NoteProjectOwnerServiceImpl extends ServiceImpl<NoteProjectOwnerMapper, NoteProjectOwnerPO> implements NoteProjectOwnerService {

    private final NoteProjectOwnerMapper noteProjectOwnerMapper;

    @Override
    public Long[] listOwnerIdsByProjectId(Long projectId) {
        return listOwnersModalByProjectId(projectId).stream().map(NoteProjectOwnerPO::getUserId).toArray(Long[]::new);
    }

    private List<NoteProjectOwnerPO> listOwnersModalByProjectId(Long projectId) {
        return noteProjectOwnerMapper.selectList(
                new LambdaQueryWrapper<NoteProjectOwnerPO>().eq(NoteProjectOwnerPO::getProjectId, projectId)
        );
    }

    @Override
    public boolean addOwners(Long projectId, Long[] ids) {
        return Arrays.stream(ids).allMatch(id -> {
            NoteProjectOwnerPO po = new NoteProjectOwnerPO();
            po.setProjectId(projectId);
            po.setUserId(id);
            return noteProjectOwnerMapper.insert(po) == 1;
        });
    }

    @Override
    public boolean deleteOwners(Long projectId, List<NoteProjectOwnerPO> ownerPOs) {
        return ownerPOs.stream().allMatch(ownerPO -> noteProjectOwnerMapper.deleteById(ownerPO) == 1);
    }

    @Override
    public boolean updateOwners(Long projectId, Long[] newIds) {
        List<NoteProjectOwnerPO> oldOwners = listOwnersModalByProjectId(projectId);

        Long[] ownerIdsNeedToAdd = Arrays.stream(newIds).filter(
                newOwnerId -> oldOwners.stream().noneMatch(oldOwner -> oldOwner.getUserId().equals(newOwnerId))
        ).toArray(Long[]::new);

        List<NoteProjectOwnerPO> ownerPOsNeedToDelete = oldOwners.stream().filter(
                oldOwner -> Arrays.stream(newIds).noneMatch(newOwnerId -> oldOwner.getUserId().equals(newOwnerId))
        ).toList();

        return addOwners(projectId, ownerIdsNeedToAdd) && deleteOwners(projectId, ownerPOsNeedToDelete);
    }

}

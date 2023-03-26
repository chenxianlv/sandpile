package org.sand.service.user.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.AllArgsConstructor;
import org.sand.mapper.user.AccessMapper;
import org.sand.model.po.user.AccessPO;
import org.sand.service.user.AccessService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class AccessServiceImpl extends ServiceImpl<AccessMapper, AccessPO> implements AccessService {

    private final AccessMapper accessMapper;

    @Override
    public List<AccessPO> listAccessByRoleId(long roleId) {
        return accessMapper.listAccessByRoleId(roleId);
    }

    @Override
    public AccessPO getByUrl(String url) {
        return getOne(new LambdaQueryWrapper<AccessPO>().eq(AccessPO::getAccessUrl, url));
    }
}

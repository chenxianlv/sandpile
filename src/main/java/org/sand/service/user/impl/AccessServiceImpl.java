package org.sand.service.user.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.sand.mapper.user.AccessMapper;
import org.sand.model.po.user.AccessPO;
import org.sand.service.user.AccessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AccessServiceImpl extends ServiceImpl<AccessMapper, AccessPO> implements AccessService {

    @Autowired
    AccessMapper accessMapper;

    @Override
    public List<AccessPO> listAccessByRoleId(long roleId) {
        return accessMapper.listAccessByRoleId(roleId);
    }
}

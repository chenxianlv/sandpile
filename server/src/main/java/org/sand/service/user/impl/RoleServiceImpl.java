package org.sand.service.user.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.AllArgsConstructor;
import org.sand.mapper.user.RoleMapper;
import org.sand.model.po.user.RolePO;
import org.sand.service.user.RoleService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class RoleServiceImpl extends ServiceImpl<RoleMapper, RolePO> implements RoleService {

    private final RoleMapper roleMapper;

    public List<RolePO> listRolesByUserId(Long userId){
        return roleMapper.listRolesByUserId(userId);
    }

    public List<RolePO> listRolesByAccessId(Long accessId){
        return roleMapper.listRolesByAccessId(accessId);
    }

}

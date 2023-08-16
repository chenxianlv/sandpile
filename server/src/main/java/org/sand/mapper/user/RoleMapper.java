package org.sand.mapper.user;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.sand.model.po.user.RolePO;

import java.util.List;

@Mapper
public interface RoleMapper extends BaseMapper<RolePO> {

    List<RolePO> listRolesByUserId(Long userId);


    List<RolePO> listRolesByAccessId(Long accessId);

}

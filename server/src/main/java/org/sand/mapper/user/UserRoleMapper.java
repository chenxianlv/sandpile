package org.sand.mapper.user;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.sand.model.po.user.UserRolePO;

@Mapper
public interface UserRoleMapper extends BaseMapper<UserRolePO> {
}

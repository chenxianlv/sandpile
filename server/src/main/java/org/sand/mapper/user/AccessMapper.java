package org.sand.mapper.user;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.sand.model.po.user.AccessPO;

import java.util.List;

@Mapper
public interface AccessMapper extends BaseMapper<AccessPO> {

    List<AccessPO> listAccessByRoleId(long roleId);

}

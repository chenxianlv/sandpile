package org.sand.service.user;

import com.baomidou.mybatisplus.extension.service.IService;
import org.sand.model.po.user.RolePO;

import java.util.List;

public interface RoleService extends IService<RolePO> {

    List<RolePO> listRolesByUserId(Long userId);

    List<RolePO> listRolesByAccessId(Long accessId);

}

package org.sand.service.user;

import com.baomidou.mybatisplus.extension.service.IService;
import org.sand.model.po.user.AccessPO;

import java.util.List;

public interface AccessService  extends IService<AccessPO> {

    List<AccessPO> listAccessByRoleId(Long roleId);

    AccessPO getByUrl(String url);

}

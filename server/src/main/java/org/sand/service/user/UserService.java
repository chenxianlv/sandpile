package org.sand.service.user;

import com.baomidou.mybatisplus.extension.service.IService;
import org.sand.model.po.user.UserPO;

import java.util.List;


public interface UserService extends IService<UserPO> {

    UserPO getByUserAccount(String userAccount);

    /**
     * 根据用户名或id模糊匹配符合的用户
     */
    List<UserPO> listUsersByIdOrUserName(String pattern);

}

package org.sand.service.user;

import com.baomidou.mybatisplus.extension.service.IService;
import org.sand.common.ResultException;
import org.sand.model.dto.user.SignupDTO;
import org.sand.model.po.user.UserPO;

import java.util.List;


public interface UserService extends IService<UserPO> {

    UserPO getByUsername(String username);

    /**
     * 根据用户名或id模糊匹配符合的用户
     */
    List<UserPO> listUsersByIdOrUsername(String pattern);

    UserPO signupUser(SignupDTO dto) throws ResultException;
}

package org.sand.service.user.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.AllArgsConstructor;
import org.sand.common.ResultException;
import org.sand.common.constDefine.ErrorCodeEnum;
import org.sand.common.constDefine.RoleEnum;
import org.sand.mapper.user.UserMapper;
import org.sand.mapper.user.UserRoleMapper;
import org.sand.model.dto.user.SignupDTO;
import org.sand.model.po.user.UserPO;
import org.sand.model.po.user.UserRolePO;
import org.sand.service.user.UserService;
import org.springframework.beans.BeanUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, UserPO> implements UserService {

    private final PasswordEncoder passwordEncoder;

    private final UserRoleMapper userRoleMapper;

    private final UserMapper userMapper;

    @Override
    public UserPO getByUsername(String username) {
        LambdaQueryWrapper<UserPO> lqw = new LambdaQueryWrapper<>();
        lqw.eq(UserPO::getUsername, username);
        return getOne(lqw);
    }

    @Override
    public List<UserPO> listUsersByIdOrUsername(String pattern) {
        LambdaQueryWrapper<UserPO> lqw = new LambdaQueryWrapper<>();
        lqw.like(UserPO::getId, pattern).or()
                .like(UserPO::getNickname, pattern);
//                .orderByAsc("CHAR_LENGTH(user_name)");
        return list(lqw);
    }

    @Override
    public UserPO signupUser(SignupDTO dto) throws ResultException {
        // 账号重复
        if (userMapper.selectOne(new LambdaQueryWrapper<UserPO>()
                .eq(UserPO::getUsername, dto.getUsername()
                )
        ) != null) {
            throw ResultException.of(ErrorCodeEnum.USERNAME_EXISTED);
        }

        UserPO userPO = new UserPO();

        BeanUtils.copyProperties(dto, userPO);
        userPO.setPassword(passwordEncoder.encode(dto.getPassword()));

        if (!save(userPO)) {
            return null;
        }

        UserRolePO userRolePO = new UserRolePO();
        userRolePO.setUserId(userPO.getId());
        userRolePO.setRoleId(RoleEnum.NORMAL_USER.getId());

        if (userRoleMapper.insert(userRolePO) == 0) {
            return null;
        }

        return userPO;
    }
}

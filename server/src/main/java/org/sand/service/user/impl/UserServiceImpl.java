package org.sand.service.user.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.sand.mapper.user.UserMapper;
import org.sand.model.po.user.UserPO;
import org.sand.service.user.UserService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, UserPO> implements UserService {

    @Override
    public UserPO getByUserAccount(String userAccount) {
        LambdaQueryWrapper<UserPO> lqw = new LambdaQueryWrapper<>();
        lqw.eq(UserPO::getUserAccount, userAccount);
        return getOne(lqw);
    }

    @Override
    public List<UserPO> listUsersByIdOrUsername(String pattern) {
        QueryWrapper<UserPO> qw = new QueryWrapper<>();
        qw.like("id", pattern).or()
                .like("user_name", pattern);
//                .orderByAsc("CHAR_LENGTH(user_name)");
        return list(qw);
    }
}

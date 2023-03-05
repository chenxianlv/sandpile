package org.sand.service.user.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.sand.mapper.user.UserMapper;
import org.sand.model.po.user.UserPO;
import org.sand.service.user.UserService;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, UserPO> implements UserService {
}

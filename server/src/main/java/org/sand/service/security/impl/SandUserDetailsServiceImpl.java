package org.sand.service.security.impl;

import org.sand.model.dto.user.UserDTO;
import org.sand.model.po.user.UserPO;
import org.sand.service.user.RoleService;
import org.sand.service.user.UserService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class SandUserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @Override
    public UserDetails loadUserByUsername(String userAccount) throws UsernameNotFoundException {

        UserPO userPO = userService.getByUserAccount(userAccount);

        if (userPO == null) {
            throw new UsernameNotFoundException("User not found");
        }

        UserDTO userDTO = new UserDTO();
        BeanUtils.copyProperties(userPO, userDTO);
        userDTO.setRoleList(roleService.listRolesByUserId(userPO.getId()));

        return userDTO;
    }
}

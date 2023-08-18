package org.sand.controller.user;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.AllArgsConstructor;
import org.sand.common.ResponseVO;
import org.sand.model.dto.user.ListUsersDTO;
import org.sand.model.po.user.UserPO;
import org.sand.model.vo.user.ListUsersUserVO;
import org.sand.model.vo.user.ListUsersVO;
import org.sand.service.user.UserService;
import org.springframework.beans.BeanUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@Api(tags = "用户模块")
@AllArgsConstructor
@RestController
@RequestMapping(value = "${project.baseUrl}/user")
public class UserController {

    private final UserService userService;

    @ApiOperation("用户查询")
    @PostMapping("/listUsers")
    public ResponseVO<?> listUsers(@Validated ListUsersDTO dto) {
        List<UserPO> userPOs = userService.listUsersByIdOrUserName(dto.getPattern());

        ListUsersVO listUsersVO = new ListUsersVO();
        listUsersVO.setUsers(userPOs.stream().map(userPO -> {
            ListUsersUserVO userVO = new ListUsersUserVO();
            BeanUtils.copyProperties(userPO, userVO);
            return userVO;
        }).collect(Collectors.toList()));

        return ResponseVO.success(listUsersVO);
    }

}

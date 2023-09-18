package org.sand.controller.user;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.AllArgsConstructor;
import org.sand.common.ResponseVO;
import org.sand.common.ResultException;
import org.sand.common.constDefine.ErrorCodeEnum;
import org.sand.model.dto.user.ListUsersDTO;
import org.sand.model.dto.user.SignupDTO;
import org.sand.model.po.user.UserPO;
import org.sand.model.vo.user.ListUserSummariesVO;
import org.sand.model.vo.user.UserSummaryVO;
import org.sand.service.user.UserService;
import org.springframework.beans.BeanUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

    @ApiOperation("根据id或用户名查询用户概况")
    @PostMapping("/listUserSummaries")
    public ResponseVO<?> listUserSummaries(@Validated  @RequestBody ListUsersDTO dto) {
        List<UserPO> userPOs = userService.listUsersByIdOrUsername(dto.getPattern());

        ListUserSummariesVO listUserSummariesVO = new ListUserSummariesVO();
        listUserSummariesVO.setUsers(userPOs.stream().map(userPO -> {
            UserSummaryVO userVO = new UserSummaryVO();
            BeanUtils.copyProperties(userPO, userVO);
            return userVO;
        }).collect(Collectors.toList()));

        return ResponseVO.success(listUserSummariesVO);
    }

    @ApiOperation("创建用户")
    @PostMapping("/signup")
    public ResponseVO<?> signup(@Validated  @RequestBody SignupDTO dto) throws ResultException {
        UserPO userPO = userService.signupUser(dto);

        if (userPO == null) {
            throw ResultException.of(ErrorCodeEnum.MODEL_ADD_FAILED);
        }

        return ResponseVO.success();
    }

}

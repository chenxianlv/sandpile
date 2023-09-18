package org.sand.config.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.sand.common.ResponseVO;
import org.sand.model.po.common.BasicTablePO;
import org.sand.model.po.user.AccessPO;
import org.sand.model.po.user.RolePO;
import org.sand.model.po.user.UserPO;
import org.sand.model.vo.user.UserLoginVO;
import org.sand.service.user.AccessService;
import org.sand.service.user.RoleService;
import org.sand.service.user.UserService;
import org.sand.util.TokenUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

@Component
@AllArgsConstructor
public class SandAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final UserService userService;

    private final RoleService roleService;

    private final AccessService accessService;

    private ObjectMapper objectMapper;

    private final TokenUtils tokenUtils;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        response.setStatus(HttpStatus.OK.value());
        response.setHeader("Content-Type","application/json;charset=utf-8");

        UserPO userPO =  userService.getByUsername(((UserDetails) authentication.getPrincipal()).getUsername());
        UserLoginVO userLoginVO = new UserLoginVO();
        BeanUtils.copyProperties(userPO, userLoginVO);

        // 设置token
        userLoginVO.setToken(tokenUtils.buildJWT(userPO.getUsername()));

        // 设置权限列表
        List<RolePO> rolePOs = roleService.listRolesByUserId(userPO.getId());
        List<AccessPO> accessPOs = new ArrayList<>();
        rolePOs.forEach(rolePO -> {
            accessPOs.addAll(accessService.listAccessByRoleId(rolePO.getId()));
        });
        userLoginVO.setAuthList(accessPOs.stream().map(BasicTablePO::getId).toArray(Long[]::new));

        PrintWriter out = response.getWriter();
        out.write(objectMapper.writeValueAsString(ResponseVO.success(userLoginVO)));
        out.flush();
        out.close();

    }
}

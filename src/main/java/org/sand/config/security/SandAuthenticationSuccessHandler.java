package org.sand.config.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.sand.model.vo.base.ResponseVO;
import org.sand.model.po.user.UserPO;
import org.sand.model.vo.base.UserLoginVO;
import org.sand.service.user.UserService;
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

@Component
@AllArgsConstructor
public class SandAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final UserService userService;

    private ObjectMapper objectMapper;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        response.setStatus(HttpStatus.OK.value());
        response.setHeader("Content-Type","application/json;charset=utf-8");

        UserPO userPO =  userService.getByUserAccount(((UserDetails) authentication.getPrincipal()).getUsername());
        UserLoginVO userLoginVO = new UserLoginVO();
        BeanUtils.copyProperties(userPO, userLoginVO);

        PrintWriter out = response.getWriter();
        out.write(objectMapper.writeValueAsString(ResponseVO.success(userLoginVO)));
        out.flush();
        out.close();

    }
}

package org.sand.config.security;

import com.alibaba.fastjson.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@Component
public class SandAuthenticationFailureHandler implements AuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException e) throws IOException, ServletException {

        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setHeader("Content-Type","application/json;charset=utf-8");

        JSONObject json = new JSONObject();
        json.put("code", 401);
        json.put("message", "登录失败");
        json.put("error", e.getMessage());

        PrintWriter out = response.getWriter();
        out.write(json.toString());
        out.flush();
        out.close();

    }
}

package org.sand.config.security;

import com.alibaba.fastjson.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@Component
public class SandAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        response.setStatus(HttpStatus.OK.value());
        response.setHeader("Content-Type","application/json;charset=utf-8");

        JSONObject json = new JSONObject();
        json.put("code", 200);
        json.put("message", "登录成功");
        json.put("data", authentication);

        PrintWriter out = response.getWriter();
        out.write(json.toString());
        out.flush();
        out.close();

    }
}

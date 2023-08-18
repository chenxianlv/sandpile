package org.sand.config.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.sand.common.constDefine.ErrorCodeEnum;
import org.sand.common.ResponseVO;
import org.sand.common.ResultException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@Component
@AllArgsConstructor
public class SandAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper objectMapper;

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException e) throws IOException, ServletException {

        response.setStatus(HttpStatus.FORBIDDEN.value());
        response.setHeader("Content-Type","application/json;charset=utf-8");

        PrintWriter out = response.getWriter();
        out.write(objectMapper.writeValueAsString(ResponseVO.error(ResultException.of(ErrorCodeEnum.INSUFFICIENT_PERMISSIONS))));
        out.flush();
        out.close();

    }
}

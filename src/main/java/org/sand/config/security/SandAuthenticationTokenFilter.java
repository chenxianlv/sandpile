package org.sand.config.security;


import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.sand.common.ConstDefine.ErrorCodeEnum;
import org.sand.common.ResponseVO;
import org.sand.common.ResultException;
import org.sand.util.TokenUtils;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@AllArgsConstructor
public class SandAuthenticationTokenFilter extends UsernamePasswordAuthenticationFilter {

    private Environment environment;

    private ObjectMapper objectMapper;

    private TokenUtils tokenUtils;

    private UserDetailsService userDetailsService;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        String tokenHeader = environment.getProperty("token.header", "");

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String path = httpRequest.getRequestURI();

        if (path.matches(".*login$")) {
            chain.doFilter(request, response);
        }

        try {
            String authToken = httpRequest.getHeader(tokenHeader);

            if (authToken == null) {
                errorHandler(httpResponse, ResultException.of(ErrorCodeEnum.LOG_IN_FIRST));
            }

            String username = tokenUtils.validToken(authToken);

            if (username != null) {
                // 认证信息未写入时
                if (SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(httpRequest));
                    // 将权限写入本次会话
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
                chain.doFilter(request, response);
            }

        } catch (ResultException e) {
            // token认证失败的场景
            errorHandler(httpResponse, e);
            httpResponse.setStatus(HttpStatus.UNAUTHORIZED.value());
            httpResponse.setHeader("Content-Type", "application/json;charset=utf-8");

            PrintWriter out = httpResponse.getWriter();
            out.write(objectMapper.writeValueAsString(ResponseVO.error(e)));
            out.flush();
            out.close();
        }
    }

    private void errorHandler(HttpServletResponse httpResponse, ResultException e) throws IOException {
        httpResponse.setStatus(HttpStatus.UNAUTHORIZED.value());
        httpResponse.setHeader("Content-Type", "application/json;charset=utf-8");

        PrintWriter out = httpResponse.getWriter();
        out.write(objectMapper.writeValueAsString(ResponseVO.error(e)));
        out.flush();
        out.close();
    }
}
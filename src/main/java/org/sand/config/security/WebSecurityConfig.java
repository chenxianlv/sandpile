package org.sand.config.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.sand.model.vo.base.ResponseVO;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.ObjectPostProcessor;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.access.intercept.FilterSecurityInterceptor;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@AllArgsConstructor
@Configuration
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    private final SandAccessDeniedHandler sandAccessDeniedHandler;

    private final SandSecurityMetadataSource sandSecurityMetadataSource;

    private final SandAccessDecisionManager sandAccessDecisionManager;

    private final SandAuthenticationProvider sandAuthenticationProvider;

    private final SandAuthenticationSuccessHandler sandAuthenticationSuccessHandler;

    private final SandAuthenticationFailureHandler sandAuthenticationFailureHandler;

    private final SandLogoutSuccessHandler sandLogoutSuccessHandler;

    private final Environment environment;

    private final ObjectMapper objectMapper;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(sandAuthenticationProvider);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        String baseUrl = environment.getProperty("project.baseUrl", "");

        http.csrf().disable();

        http.authorizeRequests().withObjectPostProcessor(new ObjectPostProcessor<FilterSecurityInterceptor>() {
            @Override
            public <O extends FilterSecurityInterceptor> O postProcess(O object) {
                object.setSecurityMetadataSource(sandSecurityMetadataSource);
                object.setAccessDecisionManager(sandAccessDecisionManager);
                return object;
            }
        }).anyRequest().authenticated();

        http.exceptionHandling()
                .accessDeniedHandler(sandAccessDeniedHandler)
                .authenticationEntryPoint(((request, response, authException) ->
                        unauthorizedErrorResponse(response, 0, "请先登录")));

        http.formLogin()
                .loginProcessingUrl(baseUrl + "/base/login")
                .usernameParameter("account")
                .passwordParameter("password")
                .successHandler(sandAuthenticationSuccessHandler)
                .failureHandler(sandAuthenticationFailureHandler);

        http.logout()
                .logoutUrl(baseUrl + "/base/logout")
                .logoutSuccessHandler(sandLogoutSuccessHandler)
                .clearAuthentication(true)
                .invalidateHttpSession(true)
                .deleteCookies(environment.getProperty("server.servlet.session.cookie.name"," "));

        http.sessionManagement()
                .invalidSessionStrategy(((request, response) ->
                        unauthorizedErrorResponse(response, 0, "登录信息过期")))
                .maximumSessions(-1);
    }

    private void unauthorizedErrorResponse(HttpServletResponse response,
                                           Integer errorCode, String errorInfo) throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setHeader("Content-Type", "application/json;charset=utf-8");

        PrintWriter out = response.getWriter();
        out.write(objectMapper.writeValueAsString(ResponseVO.error(errorCode, errorInfo)));
        out.flush();
        out.close();
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        String baseUrl = environment.getProperty("project.baseUrl", "");

        web.ignoring()
                .antMatchers(baseUrl + "/note/listProjects")
                .antMatchers(baseUrl + "/note/getNoteInfo")
                .antMatchers(baseUrl + "/note/getProjectDetail");
    }
}

package org.sand.config.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.sand.common.ConstDefine.ErrorCodeEnum;
import org.sand.common.ResponseVO;
import org.sand.common.ResultException;
import org.sand.util.TokenUtils;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.ObjectPostProcessor;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.access.intercept.FilterSecurityInterceptor;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

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

    private final TokenUtils tokenUtils;

    private final UserDetailsService userDetailsService;


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
                        unauthorizedErrorResponse(response, ResultException.of(ErrorCodeEnum.LOG_IN_FIRST))));

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
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS); // 关闭session

        http.addFilterBefore(
                new SandAuthenticationTokenFilter(environment, objectMapper, tokenUtils, userDetailsService),
                UsernamePasswordAuthenticationFilter.class
        ); // token验证
    }

    private void unauthorizedErrorResponse(HttpServletResponse response,
                                           ResultException exception) throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setHeader("Content-Type", "application/json;charset=utf-8");

        PrintWriter out = response.getWriter();
        out.write(objectMapper.writeValueAsString(ResponseVO.error(exception)));
        out.flush();
        out.close();
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        String baseUrl = environment.getProperty("project.baseUrl", "");

        // 此处的设置的url会直接放行，因此匿名用户也可访问，数据库中的权限均需用户登录才能进行判断
        web.ignoring()
                .antMatchers("/swagger-ui.html")
                .antMatchers("/webjars/**")
                .antMatchers("/v2/**")
                .antMatchers("/swagger-resources/**")
                .antMatchers(baseUrl + "/note/listProjects");
    }
}

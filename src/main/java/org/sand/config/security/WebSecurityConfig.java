package org.sand.config.security;

import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.ObjectPostProcessor;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.access.intercept.FilterSecurityInterceptor;

@AllArgsConstructor
@Configuration
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    private final SandSecurityMetadataSource sandSecurityMetadataSource;

    private final SandAccessDecisionManager sandAccessDecisionManager;

    private final SandAuthenticationProvider sandAuthenticationProvider;

    private final SandAuthenticationSuccessHandler sandAuthenticationSuccessHandler;

    private final SandAuthenticationFailureHandler sandAuthenticationFailureHandler;

    private final SandLogoutSuccessHandler sandLogoutSuccessHandler;



    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(sandAuthenticationProvider);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable();

        http.authorizeRequests().withObjectPostProcessor(new ObjectPostProcessor<FilterSecurityInterceptor>() {
            @Override
            public <O extends FilterSecurityInterceptor> O postProcess(O object) {
                object.setSecurityMetadataSource(sandSecurityMetadataSource);
                object.setAccessDecisionManager(sandAccessDecisionManager);
                return object;
            }
        }).anyRequest().authenticated();

        http.formLogin()
                .loginProcessingUrl("/api/login")
                .usernameParameter("account")
                .passwordParameter("pwd")
                .successHandler(sandAuthenticationSuccessHandler)
                .failureHandler(sandAuthenticationFailureHandler);

        http.logout()
                .logoutUrl("/api/logout")
                .logoutSuccessHandler(sandLogoutSuccessHandler)
                .clearAuthentication(true)
                .invalidateHttpSession(true);
    }
}

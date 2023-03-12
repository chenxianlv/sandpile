package org.sand.config.security;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class SandAuthenticationProvider extends DaoAuthenticationProvider {

    public SandAuthenticationProvider(PasswordEncoder passwordEncoder,
                                      @Qualifier("sandUserDetailsServiceImpl") UserDetailsService userDetailsService) {
        setPasswordEncoder(passwordEncoder);
        setUserDetailsService(userDetailsService);
        setHideUserNotFoundExceptions(false); // 区分用户不存在和密码错误异常
    }

    @Override
    public Authentication authenticate(Authentication auth) throws AuthenticationException {
        try {
            return super.authenticate(auth);

        } catch (UsernameNotFoundException e) {
            System.out.println("用户不存在");
            throw e;
        } catch (BadCredentialsException e) {
            System.out.println("密码错误");
            throw e;
        } catch (AuthenticationException e) {
            throw e;
        }

    }
}

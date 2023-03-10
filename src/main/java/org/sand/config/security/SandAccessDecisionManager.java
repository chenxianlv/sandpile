package org.sand.config.security;

import org.springframework.security.access.AccessDecisionManager;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.Collection;

@Component
public class SandAccessDecisionManager implements AccessDecisionManager {
    @Override
    public void decide(Authentication auth, Object o, Collection<ConfigAttribute> collection) throws AccessDeniedException, InsufficientAuthenticationException {
        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        System.out.println(authorities);
    }

    @Override
    public boolean supports(Class<?> aClass) {
        return true;
    }

    @Override
    public boolean supports(ConfigAttribute configAttribute) {
        return true;
    }
}

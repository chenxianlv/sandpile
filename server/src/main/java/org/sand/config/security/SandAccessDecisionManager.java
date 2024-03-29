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
    public void decide(Authentication auth, Object o, Collection<ConfigAttribute> configAttributes) throws AccessDeniedException, InsufficientAuthenticationException {
        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        if (configAttributes == null) return;

        // configAttributes为允许访问的角色
        for (ConfigAttribute attribute : configAttributes) {
            // authorities为用户拥有的角色
            for (GrantedAuthority authority : authorities) {
                if (authority.getAuthority().equals(attribute.getAttribute())) {
                    return;
                }
            }
        }

        throw new AccessDeniedException("Access is denied");
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

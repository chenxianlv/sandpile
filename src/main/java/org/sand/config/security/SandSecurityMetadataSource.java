package org.sand.config.security;

import lombok.AllArgsConstructor;
import org.sand.model.po.user.AccessPO;
import org.sand.model.po.user.RolePO;
import org.sand.service.user.AccessService;
import org.sand.service.user.RoleService;
import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.access.SecurityConfig;
import org.springframework.security.web.FilterInvocation;
import org.springframework.security.web.access.intercept.FilterInvocationSecurityMetadataSource;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.List;

@Component
@AllArgsConstructor
public class SandSecurityMetadataSource implements FilterInvocationSecurityMetadataSource {

    private final RoleService roleService;

    private final AccessService accessService;

    @Override
    public Collection<ConfigAttribute> getAttributes(Object o) throws IllegalArgumentException {
        String url = ((FilterInvocation) o).getRequestUrl();
        int index = url.indexOf('?');
        if (index > 0) {
            url = url.substring(0, index);
        }
        System.out.println(url);

        AccessPO accessPO = accessService.getByUrl(url);

        if (accessPO == null ){
            return SecurityConfig.createList();
        }

        List<RolePO> rolePOs = roleService.listRolesByAccessId(accessPO.getId());
        String[] roles = rolePOs.stream().map(RolePO::getRoleName).toArray(String[]::new);

        return SecurityConfig.createList(roles);
    }

    @Override
    public Collection<ConfigAttribute> getAllConfigAttributes() {
        return null;
    }

    @Override
    public boolean supports(Class<?> aClass) {
        return true;
    }
}

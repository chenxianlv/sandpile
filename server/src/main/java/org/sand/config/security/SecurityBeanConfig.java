package org.sand.config.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityBeanConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    public String[] anonymousUrl = new String[]{
            "/api/user/login",
            "/api/user/signup",
            "/api/note/listProjects",
            "/api/note/getProjectDetail",
            "/api/note/getNoteText"
    };

}

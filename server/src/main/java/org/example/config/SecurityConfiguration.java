package org.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfiguration {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/api/users/register", "/api/users/verify", "api/users/login").permitAll() // Public endpoints
                    .anyRequest().authenticated() // Protect all other endpoints
            )
            .csrf(csrf -> csrf
                    .ignoringRequestMatchers("/api/users/register", "/api/users/verify", "api/users/login") // Disable CSRF for these endpoints only
            )
            .httpBasic(httpBasic -> httpBasic.disable()) // Disable default Basic Auth
            .formLogin(formLogin -> formLogin.disable()); // Disable default login form

        return http.build();
    }
}

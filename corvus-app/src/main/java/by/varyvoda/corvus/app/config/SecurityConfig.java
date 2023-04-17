package by.varyvoda.corvus.app.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .cors().and().csrf().disable()
            .authorizeRequests()
            .anyRequest().permitAll();
//            .authorizeRequests()
//            .antMatchers(HttpMethod.POST, "/api/v1/auth/login", "/api/v1/security/resetPassword", "/api/v1/security/confirmPassword").permitAll()
//            .antMatchers(HttpMethod.GET, "/api/v1/security/getPasswordLength", "/api/v1/security/validateToken", "/api/v1/security/project-version").permitAll()
//            .antMatchers("/v2/api-docs", "/configuration/**", "/swagger*/**", "/webjars/**").permitAll()
//            .anyRequest().authenticated();
//
//        http
//            .sessionManagement()
//            .maximumSessions(10)
//            .maxSessionsPreventsLogin(false)
//            .sessionRegistry(sessionRegistry());
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource(@Value("${client.origin}") String clientOrigin) {
        CorsConfiguration cors = new CorsConfiguration();

        cors.setAllowCredentials(true);
        cors.addAllowedOrigin(clientOrigin);
        cors.addAllowedHeader("*");
        cors.addAllowedMethod("*");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", cors);
        return source;
    }
}

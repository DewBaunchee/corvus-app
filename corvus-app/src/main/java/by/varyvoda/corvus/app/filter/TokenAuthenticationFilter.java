package by.varyvoda.corvus.app.filter;

import by.varyvoda.corvus.app.model.security.TokenAuthentication;
import by.varyvoda.corvus.app.model.user.User;
import by.varyvoda.corvus.app.service.security.TokenService;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpHeaders;
import org.springframework.lang.NonNull;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class TokenAuthenticationFilter extends OncePerRequestFilter {

    private static final String BEARER = "Bearer";

    private final TokenService tokenService;

    private final UserDetailsService userDetailsService;

    public TokenAuthenticationFilter(
        @Lazy TokenService tokenService,
        @Lazy UserDetailsService userDetailsService
    ) {
        this.tokenService = tokenService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
        @NonNull HttpServletRequest request,
        @NonNull HttpServletResponse response,
        @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String uri = request.getRequestURI();
        boolean shouldNotSecure =
            uri.endsWith("/login")
                || uri.endsWith("/login/guest")
                || uri.endsWith("/register");

        if (shouldNotSecure) {
            filterChain.doFilter(request, response);
            return;
        }

        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (header == null || !header.startsWith(BEARER)) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "No token found in the request headers.");
            return;
        }
        String token = header.substring(BEARER.length() + 1);

        tokenService.validate(token);
        String username = tokenService.getUsername(token);
        User user = (User) userDetailsService.loadUserByUsername(username);

        var authenticationToken =
            TokenAuthentication.builder()
                .token(token)
                .user(user)
                .details(new WebAuthenticationDetailsSource().buildDetails(request))
                .authenticated(user.isAccountNonExpired())
                .build();

        var securityContext = SecurityContextHolder.getContext();
        if (securityContext.getAuthentication() == null) {
            securityContext.setAuthentication(authenticationToken);
        }

        filterChain.doFilter(request, response);
    }
}
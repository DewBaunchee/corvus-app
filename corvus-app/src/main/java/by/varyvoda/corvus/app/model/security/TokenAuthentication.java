package by.varyvoda.corvus.app.model.security;

import by.varyvoda.corvus.app.model.errors.Errors;
import by.varyvoda.corvus.app.model.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

@Data
@Builder
@AllArgsConstructor
@RequiredArgsConstructor
public class TokenAuthentication implements Authentication {

    private String token;
    private User user;
    private Object details;
    private boolean authenticated;
    private Errors errors;

    public static TokenAuthentication correct(String token, User user) {
        return builder()
            .token(token)
            .user(user)
            .build();
    }

    public static TokenAuthentication incorrect(Errors errors) {
        return builder()
            .errors(errors)
            .build();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return user.getAuthorities();
    }

    @Override
    public String getCredentials() {
        return token;
    }

    @Override
    public Object getDetails() {
        return details;
    }

    @Override
    public User getPrincipal() {
        return user;
    }

    @Override
    public boolean isAuthenticated() {
        return authenticated;
    }

    @Override
    public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {
        this.authenticated = isAuthenticated;
    }

    @Override
    public String getName() {
        if (user == null) return null;
        return user.getUsername();
    }

    public boolean hasErrors() {
        return errors != null && errors.isNotEmpty();
    }
}

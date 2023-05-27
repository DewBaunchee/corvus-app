package by.varyvoda.corvus.app.service.security;

public interface TokenService {

    String getUsername(final String token);

    String generate(String username);

    void validate(final String token);
}

package by.varyvoda.corvus.app.service.security;

import by.varyvoda.corvus.app.model.exception.SecurityException;
import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Date;

@Service
public class TokenService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.token.lifetime}")
    private Duration tokenValidity;

    public String getUsername(final String token) {
        Claims body = Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody();
        return body.getSubject();
    }

    public String generate(String username) {
        Claims claims = Jwts.claims().setSubject(username);

        final long issuedAt = System.currentTimeMillis();
        final long expiredAt = issuedAt + tokenValidity.toMillis();

        return Jwts.builder()
            .setClaims(claims)
            .setIssuedAt(new Date(issuedAt))
            .setExpiration(new Date(expiredAt))
            .signWith(SignatureAlgorithm.HS512, jwtSecret).compact();
    }

    public void validate(final String token) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
        } catch (SignatureException
                 | UnsupportedJwtException
                 | ExpiredJwtException
                 | MalformedJwtException
                 | IllegalArgumentException ex) {
            throw new SecurityException(ex);
        }
    }
}
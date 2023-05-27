package by.varyvoda.corvus.app.service.security;

import by.varyvoda.corvus.app.model.exception.SecurityException;
import io.jsonwebtoken.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class JwtTokenService implements TokenService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.token.lifetime}")
    private Duration tokenValidity;

    @Override
    public String getUsername(String token) {
        Claims body = Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody();
        return body.getSubject();
    }

    @Override
    public String generate(String username) {
        Claims claims = Jwts.claims().setSubject(username);

        var instant = Instant.now();
        var issuedAt = Date.from(instant);
        var expiredAt = Date.from(instant.plus(tokenValidity));

        return Jwts.builder()
            .setClaims(claims)
            .setIssuedAt(issuedAt)
            .setExpiration(expiredAt)
            .signWith(SignatureAlgorithm.HS512, jwtSecret).compact();
    }

    @Override
    public void validate(String token) {
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
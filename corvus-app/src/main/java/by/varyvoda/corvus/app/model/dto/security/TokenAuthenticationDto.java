package by.varyvoda.corvus.app.model.dto.security;

import by.varyvoda.corvus.app.model.errors.Errors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TokenAuthenticationDto {
    private String token;
    private String username;
    private LocalDateTime guestExpirationDate;
    private boolean hasEmail;
    private boolean isGuest;
    private Errors errors;
}

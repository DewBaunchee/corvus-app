package by.varyvoda.corvus.app.model.dto.security;

import by.varyvoda.corvus.app.model.errors.Errors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationResult {
    private boolean success;
    private Errors errors;
}

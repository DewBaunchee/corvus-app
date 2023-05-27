package by.varyvoda.corvus.app.service.security;

import by.varyvoda.corvus.app.model.dto.security.RegistrationForm;
import by.varyvoda.corvus.app.model.dto.security.FormResult;
import by.varyvoda.corvus.app.model.security.TokenAuthentication;
import org.springframework.lang.Nullable;

public interface SecurityService {

    FormResult register(RegistrationForm form);

    TokenAuthentication login(String username, String password);

    TokenAuthentication loginGuest(@Nullable String username);
}

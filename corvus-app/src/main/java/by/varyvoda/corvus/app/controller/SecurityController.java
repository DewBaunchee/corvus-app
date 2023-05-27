package by.varyvoda.corvus.app.controller;

import by.varyvoda.corvus.app.model.dto.security.RegistrationForm;
import by.varyvoda.corvus.app.model.dto.security.RegistrationResult;
import by.varyvoda.corvus.app.model.dto.security.TokenAuthenticationDto;
import by.varyvoda.corvus.app.model.security.TokenAuthentication;
import by.varyvoda.corvus.app.service.security.SecurityService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.convert.ConversionService;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;

@RestController
@RequestMapping("api/security")
@RequiredArgsConstructor
public class SecurityController {

    private final SecurityService securityService;

    private final ConversionService conversion;

    @PostMapping("register")
    public RegistrationResult register(@RequestBody RegistrationForm form) {
        return this.securityService.register(form);
    }

    @PostMapping("login")
    public TokenAuthenticationDto login(
        @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String authentication
    ) {
        if (authentication == null)
            throw new AuthenticationCredentialsNotFoundException("Specify username and password.");

        authentication = authentication.trim();
        if (authentication.indexOf("Basic") > 0)
            throw new AuthenticationCredentialsNotFoundException("Invalid credential type.");

        authentication = new String(Base64.getDecoder().decode(authentication.substring("Basic".length()).trim()));
        String username = authentication.substring(0, authentication.indexOf(":"));
        String password = authentication.substring(authentication.indexOf(":") + 1);

        var auth = securityService.login(username, password);
        return toDto(auth);
    }

    @PostMapping("login/guest")
    public TokenAuthenticationDto loginGuest(@RequestParam(required = false) String username) {
        var auth = securityService.loginGuest(username);
        return toDto(auth);
    }

    private TokenAuthenticationDto toDto(TokenAuthentication authentication) {
        return conversion.convert(authentication, TokenAuthenticationDto.class);
    }
}

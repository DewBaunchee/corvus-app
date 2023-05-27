package by.varyvoda.corvus.app.service.conversion.security;

import by.varyvoda.corvus.app.model.dto.security.TokenAuthenticationDto;
import by.varyvoda.corvus.app.model.security.TokenAuthentication;
import lombok.RequiredArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TokenAuthenticationToDtoConverter implements Converter<TokenAuthentication, TokenAuthenticationDto> {

    @Override
    public TokenAuthenticationDto convert(TokenAuthentication source) {
        if (source.hasErrors()) {
            return TokenAuthenticationDto.builder()
                .errors(source.getErrors())
                .build();
        }
        return TokenAuthenticationDto.builder()
            .token(source.getToken())
            .username(source.getName())
            .isGuest(source.getUser().isGuest())
            .build();
    }
}

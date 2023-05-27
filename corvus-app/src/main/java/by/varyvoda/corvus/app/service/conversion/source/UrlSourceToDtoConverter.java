package by.varyvoda.corvus.app.service.conversion.source;

import by.varyvoda.corvus.app.model.dto.source.UrlSourceDto;
import by.varyvoda.corvus.app.model.source.UrlSource;
import lombok.RequiredArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UrlSourceToDtoConverter implements Converter<UrlSource, UrlSourceDto> {

    @Override
    public UrlSourceDto convert(UrlSource source) {
        return UrlSourceDto.builder()
            .id(source.getId())
            .url(source.getUrl())
            .build();
    }
}

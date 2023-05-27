package by.varyvoda.corvus.app.service.conversion.source;

import by.varyvoda.corvus.app.model.dto.source.UrlSourceDto;
import by.varyvoda.corvus.app.model.source.UrlSource;
import lombok.RequiredArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UrlSourceFromDtoConverter implements Converter<UrlSourceDto, UrlSource> {

    @Override
    public UrlSource convert(UrlSourceDto source) {
        return UrlSource.builder()
            .id(source.getId())
            .url(source.getUrl())
            .build();
    }
}

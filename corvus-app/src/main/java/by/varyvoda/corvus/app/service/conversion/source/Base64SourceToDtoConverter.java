package by.varyvoda.corvus.app.service.conversion.source;

import by.varyvoda.corvus.app.model.dto.source.Base64SourceDto;
import by.varyvoda.corvus.app.model.dto.source.FileSourceDto;
import by.varyvoda.corvus.app.model.source.Base64Source;
import by.varyvoda.corvus.app.model.source.FileSource;
import lombok.RequiredArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class Base64SourceToDtoConverter implements Converter<Base64Source, Base64SourceDto> {

    @Override
    public Base64SourceDto convert(Base64Source source) {
        return Base64SourceDto.builder()
            .id(source.getId())
            .value(source.getValue())
            .build();
    }
}

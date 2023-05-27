package by.varyvoda.corvus.app.service.conversion.source;

import by.varyvoda.corvus.app.model.dto.source.Base64SourceDto;
import by.varyvoda.corvus.app.model.source.Base64Source;
import lombok.RequiredArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class Base64SourceFromDtoConverter implements Converter<Base64SourceDto, Base64Source> {

    @Override
    public Base64Source convert(Base64SourceDto source) {
        return Base64Source.builder()
            .id(source.getId())
            .value(source.getValue())
            .build();
    }
}

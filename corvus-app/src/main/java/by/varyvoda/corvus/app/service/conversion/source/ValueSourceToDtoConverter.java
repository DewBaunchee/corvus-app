package by.varyvoda.corvus.app.service.conversion.source;

import by.varyvoda.corvus.app.model.dto.source.ValueSourceDto;
import by.varyvoda.corvus.app.model.source.ValueSource;
import lombok.RequiredArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ValueSourceToDtoConverter implements Converter<ValueSource, ValueSourceDto> {

    @Override
    public ValueSourceDto convert(ValueSource source) {
        return ValueSourceDto.builder()
            .id(source.getId())
            .value(source.getValue())
            .build();
    }
}

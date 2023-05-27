package by.varyvoda.corvus.app.service.conversion.source;

import by.varyvoda.corvus.app.model.dto.source.ValueSourceDto;
import by.varyvoda.corvus.app.model.source.ValueSource;
import lombok.RequiredArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ValueSourceFromDtoConverter implements Converter<ValueSourceDto, ValueSource> {

    @Override
    public ValueSource convert(ValueSourceDto source) {
        return ValueSource.builder()
            .id(source.getId())
            .value(source.getValue())
            .build();
    }
}

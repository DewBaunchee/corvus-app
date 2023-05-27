package by.varyvoda.corvus.app.service.conversion.source;

import by.varyvoda.corvus.app.model.dto.source.SourceDto;
import by.varyvoda.corvus.app.model.source.Source;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component
public class SourceFromDtoConverter implements Converter<SourceDto, Source> {

    private final Map<Source.Type, Converter<? extends SourceDto, ? extends Source>> converterMap;

    public SourceFromDtoConverter(
        UrlSourceFromDtoConverter urlSourceFromDto,
        ValueSourceFromDtoConverter valueSourceFromDto,
        Base64SourceFromDtoConverter base64SourceFromDto
    ) {
        converterMap = new HashMap<>();
        converterMap.put(Source.Type.URL, urlSourceFromDto);
        converterMap.put(Source.Type.VALUE, valueSourceFromDto);
        converterMap.put(Source.Type.BASE64, base64SourceFromDto);
    }

    @Override
    public Source convert(SourceDto source) {
        return (Source) getConverter(source.getType())
            .map(converter -> converter.convert(source))
            .orElseThrow(() -> new IllegalArgumentException(
                "Cannot convert source of type: " + source.getType()
            ));
    }

    @SuppressWarnings("unchecked")
    private <S, R> Optional<Converter<S, R>> getConverter(Source.Type type) {
        return Optional.ofNullable((Converter<S, R>) converterMap.get(type));
    }
}

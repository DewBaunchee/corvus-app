package by.varyvoda.corvus.app.service.conversion.source;

import by.varyvoda.corvus.app.model.dto.source.SourceDto;
import by.varyvoda.corvus.app.model.source.Source;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component
public class SourceToDtoConverter implements Converter<Source, SourceDto> {

    private final Map<Source.Type, Converter<? extends Source, ? extends SourceDto>> converterMap;

    public SourceToDtoConverter(
        FileSourceToDtoConverter fileSourceToDto,
        UrlSourceToDtoConverter urlSourceToDto,
        ValueSourceToDtoConverter valueSourceToDto,
        Base64SourceToDtoConverter base64SourceToDto
    ) {
        converterMap = new HashMap<>();
        converterMap.put(Source.Type.FILE, fileSourceToDto);
        converterMap.put(Source.Type.URL, urlSourceToDto);
        converterMap.put(Source.Type.VALUE, valueSourceToDto);
        converterMap.put(Source.Type.BASE64, base64SourceToDto);
    }

    @Override
    public SourceDto convert(Source source) {
        return (SourceDto) getConverter(source.getType())
            .map(converter -> converter.convert(source))
            .orElseThrow(() -> new IllegalArgumentException(
                "Cannot convert source of type: " + source.getType()
            ));
    }

    public SourceDto convertNullable(Source source) {
        if (source == null) return null;
        return convert(source);
    }

    @SuppressWarnings("unchecked")
    private <S, R> Optional<Converter<S, R>> getConverter(Source.Type type) {
        return Optional.ofNullable((Converter<S, R>) converterMap.get(type));
    }
}

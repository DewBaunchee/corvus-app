package by.varyvoda.corvus.app.service.conversion.source;

import by.varyvoda.corvus.app.model.dto.source.FileSourceDto;
import by.varyvoda.corvus.app.model.dto.source.SourceDto;
import by.varyvoda.corvus.app.model.source.FileSource;
import by.varyvoda.corvus.app.model.source.Source;
import lombok.RequiredArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SourceToDtoConverter implements Converter<Source, SourceDto> {

    private final Converter<FileSource, FileSourceDto> fileSourceToDto;

    @Override
    public SourceDto convert(Source source) {
        if (source == null) return null;
        if (source.getType() == Source.Type.FILE) {
            return fileSourceToDto.convert((FileSource) source);
        }
        throw new IllegalArgumentException(
            "Cannot convert source of type: " + source.getType()
        );
    }
}

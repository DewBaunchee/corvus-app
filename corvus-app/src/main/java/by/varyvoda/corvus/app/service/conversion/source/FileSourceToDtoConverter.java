package by.varyvoda.corvus.app.service.conversion.source;

import by.varyvoda.corvus.app.model.dto.source.FileSourceDto;
import by.varyvoda.corvus.app.model.source.FileSource;
import lombok.RequiredArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class FileSourceToDtoConverter implements Converter<FileSource, FileSourceDto> {

    @Override
    public FileSourceDto convert(FileSource source) {
        return FileSourceDto.builder()
            .id(source.getId())
            .name(source.getName())
            .build();
    }
}

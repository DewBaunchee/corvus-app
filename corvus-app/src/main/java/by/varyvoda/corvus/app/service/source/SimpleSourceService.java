package by.varyvoda.corvus.app.service.source;

import by.varyvoda.corvus.api.format.DocumentFormat;
import by.varyvoda.corvus.api.template.Template;
import by.varyvoda.corvus.api.value.ValueDescriptor;
import by.varyvoda.corvus.app.model.source.FileSource;
import by.varyvoda.corvus.app.model.source.Source;
import by.varyvoda.corvus.app.repository.SourceRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class SimpleSourceService implements SourceService {

    private final SourceRepository sourceRepository;

    private final ObjectMapper objectMapper;

    @Override
    public FileSource createFileSource(MultipartFile file) {
        try {
            var source = FileSource.builder()
                .name(file.getOriginalFilename())
                .data(file.getBytes())
                .build();

            sourceRepository.save(source);
            return source;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public ValueDescriptor loadData(Source source) {
        if(source instanceof FileSource) {
            FileSource fileSource = (FileSource) source;
            try {
                return ValueDescriptor.of(objectMapper.readValue(fileSource.getData(), Object.class));
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
        // Temporary
        throw new RuntimeException();
    }

    @Override
    public Template loadTemplate(Source source) {
        if(source instanceof FileSource) {
            FileSource fileSource = (FileSource) source;
            return Template.builder()
                .name(fileSource.getName())
                .bytes(fileSource.getData())
                .format(DocumentFormat.fromExtension(fileSource.getExtension()))
                .build();
        }
        // Temporary
        throw new RuntimeException();
    }
}

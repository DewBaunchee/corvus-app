package by.varyvoda.corvus.app.service.source;

import by.varyvoda.corvus.api.format.DocumentFormat;
import by.varyvoda.corvus.api.template.Template;
import by.varyvoda.corvus.api.value.ValueDescriptor;
import by.varyvoda.corvus.app.model.exception.CannotResolveSource;
import by.varyvoda.corvus.app.model.exception.LogException;
import by.varyvoda.corvus.app.model.source.FileSource;
import by.varyvoda.corvus.app.model.source.Source;
import by.varyvoda.corvus.app.repository.SourceRepository;
import by.varyvoda.corvus.app.service.source.loader.SourceContentLoader;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.hibernate.proxy.HibernateProxy;
import org.springframework.boot.web.server.MimeMappings;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class SimpleSourceService implements SourceService {

    private final SourceRepository sourceRepository;

    private final ObjectMapper objectMapper;

    private final Map<Source.Type, SourceContentLoader> contentLoaders;

    public SimpleSourceService(
        SourceRepository sourceRepository,
        ObjectMapper objectMapper,
        List<SourceContentLoader> contentLoaders
    ) {
        this.sourceRepository = sourceRepository;
        this.objectMapper = objectMapper;
        this.contentLoaders =
            contentLoaders.stream()
                .collect(
                    HashMap::new,
                    (acc, loader) -> acc.compute(loader.getSourceType(), (key, presentLoader) -> {
                        if (presentLoader != null)
                            throw new IllegalArgumentException("Duplicating content loader for source type: " + key);
                        return loader;
                    }),
                    HashMap::putAll
                );
    }

    @Override
    public FileSource createFileSource(MultipartFile file) {
        try {
            FileSource fileSource = new FileSource();
            fileSource.setName(file.getOriginalFilename());
            fileSource.guessExtension();
            fileSource.setContent(file.getBytes());
            sourceRepository.save(fileSource);
            return fileSource;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Source getSource(Long id) {
        return sourceRepository.getByIdOrNull(id);
    }

    @Override
    public byte[] loadContent(Source source) {
        return Optional.ofNullable(contentLoaders.get(source.getType()))
            .map(loader -> {
                var ensuredSource = source;
                if (source instanceof HibernateProxy) {
                    ensuredSource = (Source) ((HibernateProxy) source).getHibernateLazyInitializer().getImplementation();
                }
                return loader.loadContent(ensuredSource);
            })
            .orElseThrow(() -> new CannotResolveSource(source));
    }

    @Override
    public ValueDescriptor loadData(Source source) {
        try {
            return ValueDescriptor.of(objectMapper.readValue(loadContent(source), Object.class));
        } catch (IOException e) {
            throw new LogException(e);
        }
    }

    @Override
    public Template loadTemplate(Source source) {
        return Template.builder()
            .name(source.getName())
            .bytes(loadContent(source))
            .format(DocumentFormat.fromExtension(source.getExtension()))
            .build();
    }

    @Override
    public ResponseEntity<byte[]> download(Long id) {
        return download(getSource(id));
    }

    @Override
    public ResponseEntity<byte[]> download(Source source) {
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_TYPE, MimeMappings.DEFAULT.get(source.getExtension()))
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + source.getName() + "\"")
            .body(loadContent(source));
    }
}

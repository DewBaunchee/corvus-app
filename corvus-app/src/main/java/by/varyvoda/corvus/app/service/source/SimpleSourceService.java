package by.varyvoda.corvus.app.service.source;

import by.varyvoda.corvus.api.format.DocumentFormat;
import by.varyvoda.corvus.api.template.Template;
import by.varyvoda.corvus.api.value.ValueDescriptor;
import by.varyvoda.corvus.app.model.exception.CannotResolveSource;
import by.varyvoda.corvus.app.model.exception.LogException;
import by.varyvoda.corvus.app.model.source.FileSource;
import by.varyvoda.corvus.app.model.source.Source;
import by.varyvoda.corvus.app.repository.InjectionRepository;
import by.varyvoda.corvus.app.repository.SourceRepository;
import by.varyvoda.corvus.app.service.source.loader.SourceContentLoader;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.hibernate.proxy.HibernateProxy;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static by.varyvoda.corvus.app.config.WebConfig.MIME_MAPPINGS;

@Service
public class SimpleSourceService implements SourceService {

    private final SourceRepository sourceRepository;
    private final InjectionRepository injectionRepository;
    private final ObjectMapper objectMapper;
    private final Map<Source.Type, SourceContentLoader> contentLoaders;

    public SimpleSourceService(
        SourceRepository sourceRepository,
        InjectionRepository injectionRepository,
        ObjectMapper objectMapper,
        List<SourceContentLoader> contentLoaders
    ) {
        this.injectionRepository = injectionRepository;
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
    @Transactional
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
    @Transactional
    public Source getSource(Long id) {
        return sourceRepository.getByIdOrNull(id);
    }

    @Override
    @Transactional
    public void removeSourceIfOneOrLessUses(Long id) {
        Source source = sourceRepository.getByIdOrNull(id);
        if(source == null) return;

        Integer usedInCount = injectionRepository.countByDataSourceOrTemplateSourceOrResultSource(source, source, source);
        if (usedInCount > 1) return;

        sourceRepository.deleteById(id);
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
    @Transactional
    public ResponseEntity<byte[]> download(Long id) {
        return download(getSource(id));
    }

    @Override
    public ResponseEntity<byte[]> download(Source source) {
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_TYPE, MIME_MAPPINGS.get(source.getExtension()))
            .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, HttpHeaders.CONTENT_DISPOSITION)
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + source.getName() + "\"")
            .body(loadContent(source));
    }
}

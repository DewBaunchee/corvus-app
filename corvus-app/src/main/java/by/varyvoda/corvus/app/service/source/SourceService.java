package by.varyvoda.corvus.app.service.source;

import by.varyvoda.corvus.api.template.Template;
import by.varyvoda.corvus.api.value.ValueDescriptor;
import by.varyvoda.corvus.app.model.source.FileSource;
import by.varyvoda.corvus.app.model.source.Source;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

public interface SourceService {

    FileSource createFileSource(MultipartFile file);

    Source getSource(Long id);

    byte[] loadContent(Source source);

    ValueDescriptor loadData(Source source);

    Template loadTemplate(Source source);

    ResponseEntity<byte[]> download(Long id);

    ResponseEntity<byte[]> download(Source source);
}

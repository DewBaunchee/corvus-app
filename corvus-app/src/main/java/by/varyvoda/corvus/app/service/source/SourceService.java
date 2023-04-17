package by.varyvoda.corvus.app.service.source;

import by.varyvoda.corvus.api.template.Template;
import by.varyvoda.corvus.api.value.ValueDescriptor;
import by.varyvoda.corvus.app.model.source.FileSource;
import by.varyvoda.corvus.app.model.source.Source;
import org.springframework.web.multipart.MultipartFile;

public interface SourceService {

    FileSource createFileSource(MultipartFile file);

    ValueDescriptor loadData(Source source);

    Template loadTemplate(Source source);
}

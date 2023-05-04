package by.varyvoda.corvus.app.service.source.loader;

import by.varyvoda.corvus.app.model.source.FileSource;
import by.varyvoda.corvus.app.model.source.Source;
import org.springframework.aop.support.AopUtils;
import org.springframework.stereotype.Component;

@Component
public class FileSourceContentLoader implements SourceContentLoader{

    @Override
    public Source.Type getSourceType() {
        return Source.Type.FILE;
    }

    @Override
    public byte[] loadContent(Source source) {
        return ((FileSource) source).getContent();
    }
}

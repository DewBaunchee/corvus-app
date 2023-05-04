package by.varyvoda.corvus.app.service.source.loader;

import by.varyvoda.corvus.app.model.source.Source;
import by.varyvoda.corvus.app.model.source.ValueSource;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;

@Component
public class ValueSourceContentLoader implements SourceContentLoader {

    @Override
    public Source.Type getSourceType() {
        return Source.Type.VALUE;
    }

    @Override
    public byte[] loadContent(Source source) {
        return ((ValueSource) source).getValue().getBytes(StandardCharsets.UTF_8);
    }
}

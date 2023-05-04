package by.varyvoda.corvus.app.service.source.loader;

import by.varyvoda.corvus.app.model.source.Base64Source;
import by.varyvoda.corvus.app.model.source.Source;
import org.springframework.stereotype.Component;

import java.util.Base64;

@Component
public class Base64SourceContentLoader implements SourceContentLoader {

    @Override
    public Source.Type getSourceType() {
        return Source.Type.BASE64;
    }

    @Override
    public byte[] loadContent(Source source) {
        String base64 = ((Base64Source) source).getValue();
        return Base64.getDecoder().decode(base64);
    }
}

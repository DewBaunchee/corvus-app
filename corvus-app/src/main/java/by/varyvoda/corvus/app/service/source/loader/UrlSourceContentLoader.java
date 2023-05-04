package by.varyvoda.corvus.app.service.source.loader;

import by.varyvoda.corvus.app.model.exception.LogException;
import by.varyvoda.corvus.app.model.source.Source;
import by.varyvoda.corvus.app.model.source.UrlSource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URL;

@Component
public class UrlSourceContentLoader implements SourceContentLoader {

    @Override
    public Source.Type getSourceType() {
        return Source.Type.URL;
    }

    @Override
    public byte[] loadContent(Source source) {
        try {
            UrlSource urlSource = (UrlSource) source;
            URL url = new URL(urlSource.getUrl());
            return url.openConnection().getInputStream().readAllBytes();
        } catch (IOException e) {
            throw new LogException(e);
        }
    }
}

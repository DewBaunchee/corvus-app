package by.varyvoda.corvus.app.service.source.loader;

import by.varyvoda.corvus.app.model.source.Source;

public interface SourceContentLoader {

    Source.Type getSourceType();

    byte[] loadContent(Source source);

}

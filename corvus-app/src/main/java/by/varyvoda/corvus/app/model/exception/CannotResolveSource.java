package by.varyvoda.corvus.app.model.exception;

import by.varyvoda.corvus.app.model.source.Source;
import lombok.Getter;

@Getter
public class CannotResolveSource extends CorvusException {

    private final Source source;

    public CannotResolveSource(Source source) {
        super("Cannot resolve source");
        this.source = source;
    }
}

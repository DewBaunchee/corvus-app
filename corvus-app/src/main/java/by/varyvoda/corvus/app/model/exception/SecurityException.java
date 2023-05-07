package by.varyvoda.corvus.app.model.exception;

public class SecurityException extends RuntimeException {

    public SecurityException(String message) {
        super(message);
    }

    public SecurityException(Throwable cause) {
        super(cause);
    }

    public SecurityException(String message, Throwable cause) {
        super(message, cause);
    }
}

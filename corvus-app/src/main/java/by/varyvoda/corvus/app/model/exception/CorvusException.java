package by.varyvoda.corvus.app.model.exception;

public class CorvusException extends RuntimeException {

    public CorvusException() {
        super();
    }

    public CorvusException(String message) {
        super(message);
    }

    public CorvusException(String message, Throwable cause) {
        super(message, cause);
    }

    public CorvusException(Throwable cause) {
        super(cause);
    }
}

package by.varyvoda.corvus.app.controller.advice;

import by.varyvoda.corvus.app.model.exception.CorvusException;
import by.varyvoda.corvus.app.model.exception.SubscriptionException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class DefaultControllerAdvice {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        e.printStackTrace();
        return new ResponseEntity<>("Internal error", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(CorvusException.class)
    public ResponseEntity<String> handleException(CorvusException e) {
        return new ResponseEntity<>("Internal application error", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(SubscriptionException.class)
    public ResponseEntity<String> handleException(SubscriptionException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
    }
}

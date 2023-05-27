package by.varyvoda.corvus.app.model.exception;

import by.varyvoda.corvus.app.model.subscription.SubscriptionFeature;

public class SubscriptionException extends CorvusException {

    public SubscriptionException(String message) {
        super(message);
    }

    public SubscriptionException(SubscriptionFeature feature) {
        this(feature.getName());
    }
}

package by.varyvoda.corvus.app.service.subscription;

import by.varyvoda.corvus.app.model.subscription.Subscription;
import by.varyvoda.corvus.app.model.subscription.SubscriptionLevel;
import by.varyvoda.corvus.app.model.user.User;

public interface SubscriptionService {

    Subscription createSubscription(User user, String levelKey);

    Subscription createSubscription(User user, SubscriptionLevel level);

}

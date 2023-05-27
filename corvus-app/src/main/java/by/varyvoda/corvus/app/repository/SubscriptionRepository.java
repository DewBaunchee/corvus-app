package by.varyvoda.corvus.app.repository;

import by.varyvoda.corvus.app.model.subscription.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubscriptionRepository extends JpaRepository<Subscription, Integer> {
}

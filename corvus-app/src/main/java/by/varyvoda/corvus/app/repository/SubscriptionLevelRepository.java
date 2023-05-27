package by.varyvoda.corvus.app.repository;

import by.varyvoda.corvus.app.model.subscription.SubscriptionLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubscriptionLevelRepository extends JpaRepository<SubscriptionLevel, String> {
}

package by.varyvoda.corvus.app.service.subscription;

import by.varyvoda.corvus.app.model.subscription.Subscription;
import by.varyvoda.corvus.app.model.subscription.SubscriptionFeature;
import by.varyvoda.corvus.app.model.subscription.SubscriptionLevel;
import by.varyvoda.corvus.app.model.user.User;
import by.varyvoda.corvus.app.repository.SubscriptionLevelRepository;
import by.varyvoda.corvus.app.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.transaction.Transactional;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static by.varyvoda.corvus.app.model.subscription.SubscriptionFeature.Key.*;
import static by.varyvoda.corvus.app.model.subscription.SubscriptionLevel.Keys.*;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toSet;

@Service
@Transactional
@RequiredArgsConstructor
public class RepositorySubscriptionService implements SubscriptionService {

    private final SubscriptionRepository repository;
    private final SubscriptionLevelRepository levelRepository;

    @PostConstruct
    public void sync() {
        Set<String> levelKeys = ALL;
        Set<String> storedLevelKeys =
            levelRepository.findAll().stream()
                .map(SubscriptionLevel::getKey)
                .collect(toSet());

        boolean hasDifference = !levelKeys.equals(storedLevelKeys);

        if (hasDifference) store(levelKeys);
    }

    private void store(Set<String> levelKeys) {
        Map<String, SubscriptionLevel> levels = new HashMap<>();

        levels.put(
            TRIAL,
            SubscriptionLevel.builder()
                .key(TRIAL)
                .name("Trial")
                .description("Trial version for unregistered users")
                .durationSeconds(Duration.ofDays(1).getSeconds())
                .features(List.of(
                    new SubscriptionFeature(
                        MAX_QUEUE_COUNT + "2",
                        "Max queue count",
                        "Max queue count is 2"
                    ),
                    new SubscriptionFeature(
                        MAX_INJECTION_COUNT + "5",
                        "Max queue count",
                        "Max injection count is 5"
                    ),
                    new SubscriptionFeature(
                        MAX_FILE_SIZE + "5242880",
                        "Max file size",
                        "Max file size is 5mb"
                    )
                ))
                .build()
        );

        levels.put(
            BASIC,
            SubscriptionLevel.builder()
                .key(BASIC)
                .name("Basic")
                .description("Basic version for registered users")
                .durationSeconds(Duration.ofDays(365).getSeconds())
                .features(List.of(
                    new SubscriptionFeature(
                        MAX_QUEUE_COUNT + "5",
                        "Max queue count",
                        "Max queue count is 5"
                    ),
                    new SubscriptionFeature(
                        MAX_INJECTION_COUNT + "15",
                        "Max queue count",
                        "Max injection count is 15"
                    ),
                    new SubscriptionFeature(
                        MAX_FILE_SIZE + "15728640",
                        "Max file size",
                        "Max file size is 15mb"
                    )
                ))
                .build()
        );

        levels.put(
            FULL,
            SubscriptionLevel.builder()
                .key(FULL)
                .name("Full")
                .description("Full version without limits")
                .durationSeconds(Duration.ofDays(365).getSeconds())
                .features(List.of(
                    new SubscriptionFeature(
                        MAX_QUEUE_COUNT + "infinite",
                        "Infinite queue count",
                        "Max queue count is unset"
                    ),
                    new SubscriptionFeature(
                        MAX_INJECTION_COUNT + "infinite",
                        "Infinite injection count",
                        "Max injection count is unset"
                    ),
                    new SubscriptionFeature(
                        MAX_FILE_SIZE + "infinite",
                        "Infinite file size",
                        "Max file size is unset"
                    )
                ))
                .build()
        );

        levelRepository.deleteAll();
        levelRepository.saveAll(
            levelKeys.stream()
                .map(levels::get)
                .collect(toList())
        );
    }

    @Override
    public Subscription createSubscription(User user, String levelKey) {
        return createSubscription(user, levelRepository.getById(levelKey));
    }

    @Override
    public Subscription createSubscription(User user, SubscriptionLevel level) {
        Subscription old = user.getCurrentSubscription();
        if (old != null) old.setActive(false);

        Subscription created = new Subscription();
        created.setActiveUntil(LocalDateTime.now().plusSeconds(level.getDurationSeconds()));
        created.setActive(true);
        created.setLevel(level);
        created.setUser(user);

        user.setCurrentSubscription(created);

        repository.save(created);

        return created;
    }
}

package by.varyvoda.corvus.app.service.subscription;

import by.varyvoda.corvus.app.model.exception.CorvusException;
import by.varyvoda.corvus.app.model.exception.SubscriptionException;
import by.varyvoda.corvus.app.model.subscription.SubscriptionFeature;
import by.varyvoda.corvus.app.model.user.User;
import by.varyvoda.corvus.app.repository.InjectionQueueRepository;
import by.varyvoda.corvus.app.repository.InjectionRepository;
import by.varyvoda.corvus.app.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.function.Predicate;

import static by.varyvoda.corvus.app.model.subscription.SubscriptionFeature.Key.*;

@Service
@RequiredArgsConstructor
@Transactional
public class SimpleSubscriptionConstraintsService implements SubscriptionConstraintsService {

    private static final String INFINITE_PARAM = "infinite";

    private final SubscriptionRepository subscriptionRepository;
    private final InjectionQueueRepository queueRepository;
    private final InjectionRepository injectionRepository;

    @Override
    public void checkActive(User user) {
        var subscription = user.getCurrentSubscription();
        if (!subscription.getActive())
            throw new SubscriptionException("Subscription is not active");

        var now = LocalDateTime.now();
        if (now.isAfter(subscription.getActiveUntil())) {
            subscription.setActive(false);
            subscriptionRepository.save(subscription);
            throw new SubscriptionException("Subscription is expired");
        }
    }

    @Override
    public void checkQueueCreation(User user) {
        var maxQueueCountFeature =
            findFeature(user, feature -> feature.getKey().startsWith(MAX_QUEUE_COUNT))
                .orElseThrow(() -> new SubscriptionException("Subscription haven't queue feature"));

        var maxQueueCountParam = parseOneParameterFeature(maxQueueCountFeature.getKey());

        var userQueueCount = queueRepository.countByUser(user);
        if (
            !INFINITE_PARAM.equals(maxQueueCountParam)
                && userQueueCount + 1 > Integer.parseInt(maxQueueCountParam)
        ) throw new SubscriptionException("You are out of limit of queues");
    }

    @Override
    public void checkInjectionCreation(User user, Integer queueId, int count) {
        var maxInjectionCountFeature =
            findFeature(user, feature -> feature.getKey().startsWith(MAX_INJECTION_COUNT))
                .orElseThrow(() -> new SubscriptionException("Subscription haven't injection feature"));

        var maxInjectionCountParam = parseOneParameterFeature(maxInjectionCountFeature.getKey());

        var userQueueCount = injectionRepository.countByQueueId(queueId);
        if (
            !INFINITE_PARAM.equals(maxInjectionCountParam)
                && userQueueCount + count > Integer.parseInt(maxInjectionCountParam)
        ) throw new SubscriptionException("You are out of limit of injections");
    }

    @Override
    public void checkFileSize(User user, MultipartFile file) {
        var maxFileSizeFeature =
            findFeature(user, feature -> feature.getKey().startsWith(MAX_FILE_SIZE))
                .orElseThrow(() -> new SubscriptionException("Subscription haven't injection feature"));

        var maxFileSizeParam = parseOneParameterFeature(maxFileSizeFeature.getKey());

        if (
            !INFINITE_PARAM.equals(maxFileSizeParam)
                && file.getSize() > Long.parseLong(maxFileSizeParam)
        ) throw new SubscriptionException("File is too large");
    }

    private String parseOneParameterFeature(String featureKey) {
        int lastDotIndex = featureKey.lastIndexOf('.');
        if (lastDotIndex == -1)
            throw new CorvusException("Cannot find parameter of feature: " + featureKey);
        return featureKey.substring(lastDotIndex + 1);
    }

    private Optional<SubscriptionFeature> findFeature(User user, Predicate<SubscriptionFeature> predicate) {
        return user.getCurrentSubscription()
            .getLevel().getFeatures().stream()
            .filter(predicate)
            .findAny();
    }
}

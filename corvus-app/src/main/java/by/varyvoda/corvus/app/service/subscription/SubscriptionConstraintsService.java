package by.varyvoda.corvus.app.service.subscription;

import by.varyvoda.corvus.app.model.user.User;
import org.springframework.web.multipart.MultipartFile;

public interface SubscriptionConstraintsService {
    void checkActive(User user);
    void checkQueueCreation(User user);
    void checkInjectionCreation(User user, Integer queueId, int count);
    void checkFileSize(User user, MultipartFile file);
}

package by.varyvoda.corvus.app.service.profile;

import by.varyvoda.corvus.app.model.dto.security.FormResult;
import by.varyvoda.corvus.app.model.errors.Errors;
import by.varyvoda.corvus.app.model.user.User;
import by.varyvoda.corvus.app.repository.UserRepository;
import by.varyvoda.corvus.app.service.subscription.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

import static by.varyvoda.corvus.app.model.constraints.Constraints.VALID_EMAIL;
import static by.varyvoda.corvus.app.model.subscription.SubscriptionLevel.Keys.FULL;

@Service
@RequiredArgsConstructor
@Transactional
public class RepositoryProfileService implements ProfileService {

    private final SubscriptionService subscriptionService;
    private final UserRepository userRepository;

    @Override
    public FormResult setEmail(User user, String email) {
        Errors errors = Errors.empty();

        if (!VALID_EMAIL.matcher(email).matches()) {
            errors.addError("email", "Provided value is not e-mail address.");
        }

        if (user.getEmail() != null) {
            errors.addError("email", "E-Mail is already provided.");
        }

        if (errors.isNotEmpty()) {
            return FormResult.builder()
                .success(false)
                .errors(errors)
                .build();
        }

        user.setEmail(email);

        subscriptionService.createSubscription(user, FULL);

        userRepository.save(user);

        return FormResult.builder()
            .success(true)
            .errors(errors)
            .build();
    }
}

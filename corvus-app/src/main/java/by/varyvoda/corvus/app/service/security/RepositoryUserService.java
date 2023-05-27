package by.varyvoda.corvus.app.service.security;

import by.varyvoda.corvus.app.model.dto.security.RegistrationForm;
import by.varyvoda.corvus.app.model.dto.security.RegistrationResult;
import by.varyvoda.corvus.app.model.errors.Errors;
import by.varyvoda.corvus.app.model.security.TokenAuthentication;
import by.varyvoda.corvus.app.model.user.User;
import by.varyvoda.corvus.app.repository.UserRepository;
import by.varyvoda.corvus.app.service.subscription.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.Nullable;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.UUID;

import static by.varyvoda.corvus.app.model.subscription.SubscriptionLevel.Keys.*;
import static by.varyvoda.corvus.app.model.user.Role.Keys.GUEST;
import static by.varyvoda.corvus.app.model.user.Role.Keys.USER;

@Service
@Transactional
@RequiredArgsConstructor
public class RepositoryUserService implements UserDetailsService, UserService, SecurityService {

    private final UserRepository userRepository;
    private final TokenService tokenService;
    private final RepositoryRoleService roleService;
    private final PasswordEncoder passwordEncoder;
    private final SubscriptionService subscriptionService;

    @Override
    public User getUser(String username) {
        return userRepository.getByUsername(username);
    }

    @Override
    public User loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = getUser(username);
        if (user == null) throw new UsernameNotFoundException("Username not found: " + username);
        return user;
    }

    @Override
    public RegistrationResult register(RegistrationForm form) {
        Errors errors = Errors.empty();

        String username = form.getUsername();
        String email = form.getEmail();
        String password = form.getPassword();

        if (userRepository.existsByUsername(username)) {
            errors.addError("username", "Such user already exists");
        }

        if (errors.isNotEmpty()) return fromErrors(errors);

        if (email == null) email = "";

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(roleService.getRole(USER));
        subscriptionService.createSubscription(user, email.isBlank() ? BASIC : FULL);
        userRepository.save(user);

        return new RegistrationResult(true, Errors.empty());
    }

    private RegistrationResult fromErrors(Errors errors) {
        return new RegistrationResult(errors.isEmpty(), errors);
    }

    @Override
    public TokenAuthentication login(String username, String password) {
        Errors errors = Errors.empty();
        User user = getUser(username);

        if (user == null)
            return TokenAuthentication.incorrect(
                errors.addError("username", "User with such username is not found")
            );

        boolean passwordMatches = passwordEncoder.matches(password, user.getPassword());

        if (!passwordMatches)
            return TokenAuthentication.incorrect(
                errors.addError("password", "Incorrect password")
            );

        String token = tokenService.generate(username);
        return TokenAuthentication.correct(token, user);
    }

    @Override
    public TokenAuthentication loginGuest(@Nullable String username) {
        User user = getOrCreateGuest(username);
        String token = tokenService.generate(user.getUsername());
        return TokenAuthentication.correct(token, user);
    }

    private User getOrCreateGuest(String username) {
        User user = null;
        if (username != null) {
            user = getUser(username);
        }

        if (user != null && user.isAccountNonExpired()) {
            return user;
        }

        return createGuest();
    }

    private User createGuest() {
        User user = new User();
        user.setUsername(generateGuestName());
        user.setRole(roleService.getRole(GUEST));
        subscriptionService.createSubscription(user, TRIAL);
        userRepository.save(user);
        return user;
    }

    private synchronized String generateGuestName() {
        return "guest-" + UUID.randomUUID();
    }
}

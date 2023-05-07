package by.varyvoda.corvus.app.service.security;

import by.varyvoda.corvus.app.model.errors.Errors;
import by.varyvoda.corvus.app.model.security.TokenAuthentication;
import by.varyvoda.corvus.app.model.user.Role;
import by.varyvoda.corvus.app.model.user.User;
import by.varyvoda.corvus.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.Nullable;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class SecurityService implements UserDetailsService {

    private final UserRepository userRepository;
    private final TokenService tokenService;
    private final RoleService roleService;
    private final PasswordEncoder passwordEncoder;

    public User getUser(String username) {
        return userRepository.getByUsername(username);
    }

    @Override
    public User loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = getUser(username);
        if (user == null) throw new UsernameNotFoundException("Username not found: " + username);
        return user;
    }

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
        user.setRole(roleService.getRole(Role.Key.GUEST));
        userRepository.save(user);
        return user;
    }

    private synchronized String generateGuestName() {
        return "guest-" + UUID.randomUUID();
    }
}

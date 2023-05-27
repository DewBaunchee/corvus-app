package by.varyvoda.corvus.app.controller;

import by.varyvoda.corvus.app.model.dto.security.FormResult;
import by.varyvoda.corvus.app.model.dto.subscription.SubscriptionDto;
import by.varyvoda.corvus.app.model.security.TokenAuthentication;
import by.varyvoda.corvus.app.model.user.User;
import by.varyvoda.corvus.app.service.profile.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.convert.ConversionService;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ConversionService conversion;
    private final ProfileService profile;

    @GetMapping("subscription/current")
    public SubscriptionDto getCurrentSubscription(Principal principal) {
        User user = asUser(principal);
        return conversion.convert(user.getCurrentSubscription(), SubscriptionDto.class);
    }

    @PostMapping("email/set")
    public FormResult setEmail(@RequestParam String email, Principal principal) {
        User user = asUser(principal);
        return profile.setEmail(user, email);
    }

    private User asUser(Principal principal) {
        return ((TokenAuthentication) principal).getPrincipal();
    }
}

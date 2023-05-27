package by.varyvoda.corvus.app.controller;

import by.varyvoda.corvus.app.model.dto.subscription.SubscriptionDto;
import by.varyvoda.corvus.app.model.security.TokenAuthentication;
import by.varyvoda.corvus.app.model.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.core.convert.ConversionService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ConversionService conversion;

    @GetMapping("subscription/current")
    public SubscriptionDto getCurrentSubscription(Principal principal) {
        User user = asUser(principal);
        return conversion.convert(user.getCurrentSubscription(), SubscriptionDto.class);
    }

    private User asUser(Principal principal) {
        return ((TokenAuthentication) principal).getPrincipal();
    }
}

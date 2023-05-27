package by.varyvoda.corvus.app.service.conversion.subscription;

import by.varyvoda.corvus.app.model.dto.subscription.SubscriptionDto;
import by.varyvoda.corvus.app.model.dto.subscription.SubscriptionLevelDto;
import by.varyvoda.corvus.app.model.subscription.Subscription;
import by.varyvoda.corvus.app.model.subscription.SubscriptionLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SubscriptionToDtoConverter implements Converter<Subscription, SubscriptionDto> {

    private final Converter<SubscriptionLevel, SubscriptionLevelDto> subscriptionLevelToDtoConverter;

    @Override
    public SubscriptionDto convert(Subscription source) {
        return new SubscriptionDto(
            source.getId(),
            source.getActiveUntil(),
            subscriptionLevelToDtoConverter.convert(source.getLevel())
        );
    }
}

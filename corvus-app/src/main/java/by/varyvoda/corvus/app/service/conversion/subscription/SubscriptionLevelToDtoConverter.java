package by.varyvoda.corvus.app.service.conversion.subscription;

import by.varyvoda.corvus.app.model.dto.subscription.SubscriptionFeatureDto;
import by.varyvoda.corvus.app.model.dto.subscription.SubscriptionLevelDto;
import by.varyvoda.corvus.app.model.subscription.SubscriptionFeature;
import by.varyvoda.corvus.app.model.subscription.SubscriptionLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class SubscriptionLevelToDtoConverter implements Converter<SubscriptionLevel, SubscriptionLevelDto> {

    private final Converter<SubscriptionFeature, SubscriptionFeatureDto> subscriptionFeatureToDtoConverter;

    @Override
    public SubscriptionLevelDto convert(SubscriptionLevel source) {
        return new SubscriptionLevelDto(
            source.getKey(),
            source.getName(),
            source.getDescription(),
            source.getFeatures().stream()
                .map(subscriptionFeatureToDtoConverter::convert)
                .collect(Collectors.toList())
        );
    }
}

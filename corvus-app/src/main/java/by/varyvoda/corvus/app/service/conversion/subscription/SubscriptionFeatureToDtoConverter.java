package by.varyvoda.corvus.app.service.conversion.subscription;

import by.varyvoda.corvus.app.model.dto.subscription.SubscriptionFeatureDto;
import by.varyvoda.corvus.app.model.subscription.SubscriptionFeature;
import lombok.RequiredArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SubscriptionFeatureToDtoConverter implements Converter<SubscriptionFeature, SubscriptionFeatureDto> {

    @Override
    public SubscriptionFeatureDto convert(SubscriptionFeature source) {
        return new SubscriptionFeatureDto(
            source.getKey(),
            source.getName(),
            source.getDescription()
        );
    }
}

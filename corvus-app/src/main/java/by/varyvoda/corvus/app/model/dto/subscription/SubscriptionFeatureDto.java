package by.varyvoda.corvus.app.model.dto.subscription;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionFeatureDto {
    private String key;
    private String name;
    private String description;
}

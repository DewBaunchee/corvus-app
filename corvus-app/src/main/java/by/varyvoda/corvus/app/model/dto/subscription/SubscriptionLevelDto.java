package by.varyvoda.corvus.app.model.dto.subscription;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionLevelDto {
    private String key;
    private String name;
    private String description;
    private List<SubscriptionFeatureDto> features;
}

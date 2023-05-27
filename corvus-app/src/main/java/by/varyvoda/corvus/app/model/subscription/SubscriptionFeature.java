package by.varyvoda.corvus.app.model.subscription;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "subscription_feature")
public class SubscriptionFeature {

    @Id
    @Column(name = "key")
    private String key;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", nullable = false)
    private String description;

    public static class Key {
        public static final String MAX_QUEUE_COUNT = "max.queue.count.";
        public static final String MAX_INJECTION_COUNT = "max.injection.count.";
        public static final String MAX_FILE_SIZE = "max.file.size.";
    }
}

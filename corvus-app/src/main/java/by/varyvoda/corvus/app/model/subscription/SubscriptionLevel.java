package by.varyvoda.corvus.app.model.subscription;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "subscription_level")
public class SubscriptionLevel {

    @Id
    @Column(name = "key")
    private String key;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "duration_seconds", nullable = false)
    private Long durationSeconds;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(
        name = "subscription_features",
        joinColumns = {@JoinColumn(name = "subscription_level")},
        inverseJoinColumns = {@JoinColumn(name = "subscription_feature")}
    )
    private List<SubscriptionFeature> features;

    public static class Keys {
        public static final String TRIAL = "TRIAL";
        public static final String BASIC = "BASIC";
        public static final String FULL = "FULL";
        public static final Set<String> ALL = Set.of(TRIAL, BASIC, FULL);
    }
}

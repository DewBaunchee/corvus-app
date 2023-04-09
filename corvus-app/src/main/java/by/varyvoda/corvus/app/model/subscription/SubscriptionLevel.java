package by.varyvoda.corvus.app.model.subscription;

import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "subscription_level")
@Data
public class SubscriptionLevel {

    @Id
    @Column(name = "key")
    private String key;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @ManyToMany
    @JoinTable(
        name = "subscription_features",
        joinColumns = { @JoinColumn(name = "subscription_level") },
        inverseJoinColumns = { @JoinColumn(name = "subscription_feature") }
    )
    private List<SubscriptionFeature> features;
}

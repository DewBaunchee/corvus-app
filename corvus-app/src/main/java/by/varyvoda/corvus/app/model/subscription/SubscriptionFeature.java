package by.varyvoda.corvus.app.model.subscription;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "subscription_feature")
@Data
public class SubscriptionFeature {

    @Id
    @Column(name = "key")
    private String key;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;
}

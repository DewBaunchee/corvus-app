package by.varyvoda.corvus.app.model.subscription;

import by.varyvoda.corvus.app.model.user.User;
import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "subscription")
@Data
public class Subscription {

    @Id
    @GeneratedValue
    @Column(name = "id")
    private Integer id;

    @Column(name = "active_until")
    private LocalDateTime activeUntil;

    @Column(name = "api_key")
    private String apiKey;

    @ManyToOne
    @JoinColumn(name = "level")
    private SubscriptionLevel level;

    @ManyToOne
    @JoinColumn(name = "user")
    private User user;
}

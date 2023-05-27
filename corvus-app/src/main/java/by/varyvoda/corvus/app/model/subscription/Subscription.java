package by.varyvoda.corvus.app.model.subscription;

import by.varyvoda.corvus.app.model.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "subscription")
public class Subscription {

    @Id
    @GeneratedValue
    @Column(name = "id")
    private Integer id;

    @Column(name = "active_until")
    private LocalDateTime activeUntil;

    @Column(name = "active", nullable = false)
    private Boolean active;

    @ManyToOne
    @JoinColumn(name = "level", nullable = false)
    private SubscriptionLevel level;

    @ManyToOne
    @JoinColumn(name = "\"user\"")
    private User user;

}

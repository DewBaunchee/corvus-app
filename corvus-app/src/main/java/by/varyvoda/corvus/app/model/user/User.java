package by.varyvoda.corvus.app.model.user;

import by.varyvoda.corvus.app.model.subscription.Subscription;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "\"user\"")
@Data
public class User implements UserDetails {

    @Id
    @GeneratedValue
    @Column(name = "id")
    private Integer id;

    @Column(name = "username", unique = true)
    private String username;

    @Column(name = "password")
    private String password;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "expired_at")
    private LocalDateTime expiredAt;

    @ManyToOne
    @JoinColumn(name = "role")
    private Role role;

    @OneToOne
    @JoinColumn(name = "active_subscription")
    private Subscription activeSubscription;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(role);
    }

    @Override
    public boolean isAccountNonExpired() {
        if (expiredAt == null) return true;
        return LocalDateTime.now().isBefore(expiredAt);
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public boolean isGuest() {
        return role.getKey() == Role.Key.GUEST;
    }
}

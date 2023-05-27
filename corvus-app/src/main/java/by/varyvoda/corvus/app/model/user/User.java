package by.varyvoda.corvus.app.model.user;

import by.varyvoda.corvus.app.model.subscription.Subscription;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import java.util.Collection;
import java.util.List;
import java.util.Objects;

import static by.varyvoda.corvus.app.model.user.Role.Keys.GUEST;

@Entity
@Table(name = "\"user\"")
@Data
public class User implements UserDetails {

    @Id
    @GeneratedValue
    @Column(name = "id")
    private Integer id;

    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @Column(name = "password")
    private String password;

    @Column(name = "email")
    private String email;

    @ManyToOne
    @JoinColumn(name = "role", nullable = false)
    private Role role;

    @OneToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE})
    @JoinColumn(name = "current_subscription", nullable = false)
    private Subscription currentSubscription;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(role);
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
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
        return Objects.equals(role.getKey(), GUEST);
    }

    @Override
    public String toString() {
        return username;
    }
}

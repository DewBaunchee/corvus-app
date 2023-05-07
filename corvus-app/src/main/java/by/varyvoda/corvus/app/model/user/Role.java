package by.varyvoda.corvus.app.model.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;

import javax.persistence.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "role")
public class Role implements GrantedAuthority {

    @Id
    @Column(name = "key")
    @Enumerated(EnumType.STRING)
    private Key key;

    @Override
    public String getAuthority() {
        return key.name();
    }

    public enum Key {
        GUEST, USER
    }
}

package by.varyvoda.corvus.app.model.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "role")
public class Role implements GrantedAuthority {

    @Id
    @Column(name = "key")
    private String key;

    @Override
    public String getAuthority() {
        return key;
    }

    public static class Keys {
        public static final String GUEST = "GUEST";
        public static final String USER = "USER";
        public static final Set<String> ALL = Set.of(GUEST, USER);
    }
}

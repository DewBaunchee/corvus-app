package by.varyvoda.corvus.app.repository;

import by.varyvoda.corvus.app.model.user.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Role.Key> {
}

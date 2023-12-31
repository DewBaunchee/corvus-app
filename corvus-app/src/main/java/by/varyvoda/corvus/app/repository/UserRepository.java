package by.varyvoda.corvus.app.repository;

import by.varyvoda.corvus.app.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    User getByUsername(String username);

    boolean existsByUsername(String username);
}

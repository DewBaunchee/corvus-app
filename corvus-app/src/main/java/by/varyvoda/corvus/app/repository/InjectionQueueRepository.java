package by.varyvoda.corvus.app.repository;

import by.varyvoda.corvus.app.model.injection.InjectionQueue;
import by.varyvoda.corvus.app.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InjectionQueueRepository extends JpaRepository<InjectionQueue, Integer> {

    default InjectionQueue getByIdOrNull(Integer id) {
        if (existsById(id))
            return getById(id);
        return null;
    }

    List<InjectionQueue> getAllByUser(User user);

    Integer countByUser(User user);

    boolean existsByUserAndName(User user, String name);
}

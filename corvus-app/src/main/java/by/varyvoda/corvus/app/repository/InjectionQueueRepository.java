package by.varyvoda.corvus.app.repository;

import by.varyvoda.corvus.app.model.injection.InjectionQueue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InjectionQueueRepository extends JpaRepository<InjectionQueue, Integer> {

    default InjectionQueue getByIdOrNull(Integer id) {
        if (existsById(id))
            return getById(id);
        return null;
    }
}

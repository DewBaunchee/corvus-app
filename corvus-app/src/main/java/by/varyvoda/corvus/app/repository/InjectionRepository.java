package by.varyvoda.corvus.app.repository;

import by.varyvoda.corvus.app.model.injection.Injection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InjectionRepository extends JpaRepository<Injection, Integer> {

    default Injection getByIdOrNull(Integer id) {
        if (existsById(id))
            return getById(id);
        return null;
    }
}

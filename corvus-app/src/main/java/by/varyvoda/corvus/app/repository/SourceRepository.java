package by.varyvoda.corvus.app.repository;

import by.varyvoda.corvus.app.model.source.Source;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SourceRepository extends JpaRepository<Source, Long> {

    default Source getByIdOrNull(Long id) {
        if (existsById(id))
            return getById(id);
        return null;
    }
}

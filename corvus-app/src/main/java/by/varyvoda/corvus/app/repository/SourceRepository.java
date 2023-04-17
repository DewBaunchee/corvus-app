package by.varyvoda.corvus.app.repository;

import by.varyvoda.corvus.app.model.source.FileSource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SourceRepository extends JpaRepository<FileSource, Long> {
}

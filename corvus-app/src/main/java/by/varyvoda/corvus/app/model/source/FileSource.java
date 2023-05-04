package by.varyvoda.corvus.app.model.source;

import lombok.*;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@DiscriminatorValue("FILE")
public class FileSource extends Source {

    {
        setType(Type.FILE);
    }

    @Column(name = "content")
    private byte[] content;

}

package by.varyvoda.corvus.app.model.source;

import lombok.*;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

import static by.varyvoda.corvus.app.model.constraints.Constraints.Source.Value.MAX_LENGTH;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@DiscriminatorValue("VALUE")
public class ValueSource extends Source {

    {
        setType(Type.VALUE);
    }

    @Column(name = "value", nullable = false, length = MAX_LENGTH)
    private String value;

    @Builder
    public ValueSource(Long id, String value) {
        super();
        setId(id);
        this.value = value;
    }
}

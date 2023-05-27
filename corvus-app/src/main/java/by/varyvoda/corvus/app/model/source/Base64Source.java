package by.varyvoda.corvus.app.model.source;

import lombok.*;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

import static by.varyvoda.corvus.app.model.constraints.Constraints.Source.Base64.MAX_LENGTH;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@DiscriminatorValue("BASE64")
public class Base64Source extends Source {

    {
        setType(Type.BASE64);
    }

    @Column(name = "value", nullable = false, length = MAX_LENGTH)
    private String value;

    @Builder
    public Base64Source(Long id, String value) {
        super();
        setId(id);
        this.value = value;
    }
}
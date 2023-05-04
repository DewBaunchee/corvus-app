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
@DiscriminatorValue("URL")
public class UrlSource extends Source {

    {
        setType(Type.URL);
    }

    @Column(name = "url")
    private String url;
}

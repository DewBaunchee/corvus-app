package by.varyvoda.corvus.app.model.source;

import lombok.*;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

import static by.varyvoda.corvus.app.model.constraints.Constraints.Source.Url.MAX_LENGTH;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@DiscriminatorValue("URL")
public class UrlSource extends Source {

    {
        setType(Type.URL);
    }

    @Column(name = "url", nullable = false, length = MAX_LENGTH)
    private String url;

    @Builder
    public UrlSource(Long id, String url) {
        super();
        this.setId(id);
        this.url = url;
    }
}

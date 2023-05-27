package by.varyvoda.corvus.app.model.dto.source;

import by.varyvoda.corvus.app.model.source.Source;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class UrlSourceDto extends SourceDto {

    {
        setType(Source.Type.URL);
    }

    private String url;

    @Builder
    public UrlSourceDto(Long id, String url) {
        super(id, Source.Type.URL);
        this.url = url;
    }
}

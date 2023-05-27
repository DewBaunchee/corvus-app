package by.varyvoda.corvus.app.model.dto.source;

import by.varyvoda.corvus.app.model.source.Source;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class ValueSourceDto extends SourceDto {

    {
        setType(Source.Type.VALUE);
    }

    private String value;

    @Builder
    public ValueSourceDto(Long id, String value) {
        super(id, Source.Type.VALUE);
        this.value = value;
    }
}

package by.varyvoda.corvus.app.model.dto.source;

import by.varyvoda.corvus.app.model.source.Source;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class Base64SourceDto extends SourceDto {

    {
        setType(Source.Type.BASE64);
    }

    private String value;

    @Builder
    public Base64SourceDto(Long id, String value) {
        super(id, Source.Type.BASE64);
        this.value = value;
    }
}

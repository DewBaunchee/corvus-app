package by.varyvoda.corvus.app.model.dto.source;

import by.varyvoda.corvus.app.model.source.Source;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class FileSourceDto extends SourceDto {

    {
        setType(Source.Type.FILE);
    }

    private String name;

    @Builder
    public FileSourceDto(Long id, String name) {
        super(id, Source.Type.FILE);
        this.name = name;
    }
}

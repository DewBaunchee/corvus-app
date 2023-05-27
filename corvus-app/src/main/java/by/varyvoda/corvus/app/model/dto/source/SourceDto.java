package by.varyvoda.corvus.app.model.dto.source;

import by.varyvoda.corvus.app.model.source.Source;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    property = "type")
@JsonSubTypes({
    @JsonSubTypes.Type(value = FileSourceDto.class, name = "FILE"),
    @JsonSubTypes.Type(value = UrlSourceDto.class, name = "URL"),
    @JsonSubTypes.Type(value = ValueSourceDto.class, name = "VALUE"),
    @JsonSubTypes.Type(value = Base64SourceDto.class, name = "BASE64")
})
public abstract class SourceDto {
    private Long id;
    private Source.Type type;
}

package by.varyvoda.corvus.app.model.dto.injection;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InjectionQueueHeaderDto {
    private Integer id;
    private String name;
}

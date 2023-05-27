package by.varyvoda.corvus.app.model.dto.injection;

import by.varyvoda.corvus.app.model.injection.InjectionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InjectionQueueDto {
    private Integer id;
    private String name;
    private InjectionStatus status;
    private List<InjectionDto> injections;
}

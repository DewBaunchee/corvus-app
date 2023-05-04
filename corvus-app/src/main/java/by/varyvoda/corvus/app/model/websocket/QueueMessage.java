package by.varyvoda.corvus.app.model.websocket;

import by.varyvoda.corvus.app.model.dto.injection.InjectionDto;
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
public class QueueMessage {
    private Integer queueId;
    private InjectionStatus status;
    private List<InjectionDto> injections;
    private List<InjectionDto> addedInjections;
    private List<InjectionDto> removedInjections;
    private List<InjectionDto> updatedInjections;
}

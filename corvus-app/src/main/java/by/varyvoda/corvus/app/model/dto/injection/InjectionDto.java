package by.varyvoda.corvus.app.model.dto.injection;

import by.varyvoda.corvus.api.format.DocumentFormat;
import by.varyvoda.corvus.app.model.dto.source.SourceDto;
import by.varyvoda.corvus.app.model.injection.InjectionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InjectionDto {
    private Integer id;
    private Integer queueId;
    private Integer orderId;
    private InjectionStatus status;
    private SourceDto dataSource;
    private SourceDto templateSource;
    private DocumentFormat outputFormat;
    private String preferredResultName;
}

package by.varyvoda.corvus.app.service.conversion.injection;

import by.varyvoda.corvus.app.model.dto.injection.InjectionDto;
import by.varyvoda.corvus.app.model.injection.Injection;
import by.varyvoda.corvus.app.service.conversion.source.SourceToDtoConverter;
import lombok.RequiredArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InjectionToDtoConverter implements Converter<Injection, InjectionDto> {

    private final SourceToDtoConverter sourceToDto;

    @Override
    public InjectionDto convert(Injection source) {
        return InjectionDto.builder()
            .id(source.getId())
            .queueId(source.getQueue().getId())
            .orderId(source.getOrderId())
            .status(source.getStatus())
            .dataSource(sourceToDto.convert(source.getDataSource()))
            .templateSource(sourceToDto.convert(source.getTemplateSource()))
            .build();
    }
}

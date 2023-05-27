package by.varyvoda.corvus.app.service.conversion.injection;

import by.varyvoda.corvus.app.model.dto.injection.InjectionQueueHeaderDto;
import by.varyvoda.corvus.app.model.injection.InjectionQueue;
import lombok.RequiredArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InjectionQueueToHeaderDtoConverter implements Converter<InjectionQueue, InjectionQueueHeaderDto> {

    @Override
    public InjectionQueueHeaderDto convert(InjectionQueue source) {
        return new InjectionQueueHeaderDto(
            source.getId(),
            source.getName()
        );
    }
}

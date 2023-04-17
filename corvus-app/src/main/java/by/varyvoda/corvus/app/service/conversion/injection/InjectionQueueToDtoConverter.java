package by.varyvoda.corvus.app.service.conversion.injection;

import by.varyvoda.corvus.app.model.dto.injection.InjectionDto;
import by.varyvoda.corvus.app.model.dto.injection.InjectionQueueDto;
import by.varyvoda.corvus.app.model.injection.Injection;
import by.varyvoda.corvus.app.model.injection.InjectionQueue;
import lombok.RequiredArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class InjectionQueueToDtoConverter implements Converter<InjectionQueue, InjectionQueueDto> {

    private final Converter<Injection, InjectionDto> injectionToDtoConverter;

    @Override
    public InjectionQueueDto convert(InjectionQueue source) {
        return InjectionQueueDto.builder()
            .id(source.getId())
            .injections(
                source.getInjections().stream()
                    .map(injectionToDtoConverter::convert)
                    .collect(Collectors.toList())
            )
            .build();
    }
}

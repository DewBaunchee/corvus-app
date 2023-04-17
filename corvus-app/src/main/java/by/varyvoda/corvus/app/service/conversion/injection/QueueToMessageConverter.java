package by.varyvoda.corvus.app.service.conversion.injection;

import by.varyvoda.corvus.app.model.dto.injection.InjectionDto;
import by.varyvoda.corvus.app.model.injection.Injection;
import by.varyvoda.corvus.app.model.injection.InjectionQueue;
import by.varyvoda.corvus.app.model.websocket.QueueMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class QueueToMessageConverter implements Converter<InjectionQueue, QueueMessage> {

    private final Converter<Injection, InjectionDto> injectionToDtoConverter;

    @Override
    public QueueMessage convert(InjectionQueue source) {
        return QueueMessage.builder()
            .queueId(source.getId())
            .status(source.getStatus())
            .injections(convertInjections(source.getInjections()))
            .build();
    }

    private List<InjectionDto> convertInjections(List<Injection> injections) {
        return injections.stream()
            .map(injectionToDtoConverter::convert)
            .collect(Collectors.toList());
    }
}

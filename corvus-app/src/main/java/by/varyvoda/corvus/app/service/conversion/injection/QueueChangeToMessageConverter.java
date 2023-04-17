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
public class QueueChangeToMessageConverter implements Converter<InjectionQueue.Change, QueueMessage> {

    private final Converter<Injection, InjectionDto> injectionToDtoConverter;

    @Override
    public QueueMessage convert(InjectionQueue.Change source) {
        return QueueMessage.builder()
            .queueId(source.getQueueId())
            .status(source.getStatus())
            .injections(convertInjections(source.getInjections()))
            .addedInjections(convertInjections(source.getAddedInjections()))
            .updatedInjections(convertInjections(source.getUpdatedInjections()))
            .build();
    }

    private List<InjectionDto> convertInjections(List<Injection> injections) {
        if (injections == null) return null;

        return injections.stream()
            .map(injectionToDtoConverter::convert)
            .collect(Collectors.toList());
    }
}

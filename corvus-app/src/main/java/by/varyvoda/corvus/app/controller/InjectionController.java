package by.varyvoda.corvus.app.controller;

import by.varyvoda.corvus.api.format.DocumentFormat;
import by.varyvoda.corvus.app.model.dto.injection.InjectionQueueDto;
import by.varyvoda.corvus.app.model.dto.injection.InjectionQueueHeaderDto;
import by.varyvoda.corvus.app.model.dto.source.SourceDto;
import by.varyvoda.corvus.app.model.injection.InjectionQueue;
import by.varyvoda.corvus.app.model.security.TokenAuthentication;
import by.varyvoda.corvus.app.model.source.Source;
import by.varyvoda.corvus.app.model.user.User;
import by.varyvoda.corvus.app.model.websocket.QueueMessage;
import by.varyvoda.corvus.app.service.injection.InjectionService;
import by.varyvoda.corvus.app.service.source.SourceService;
import by.varyvoda.corvus.app.service.subscription.SubscriptionConstraintsService;
import by.varyvoda.corvus.app.service.websocket.WebSocketSendService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.convert.ConversionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("api/injection")
public class InjectionController {

    private final SubscriptionConstraintsService constraints;
    private final InjectionService queueService;
    private final SourceService sourceService;
    private final ConversionService conversionService;
    private final WebSocketSendService ws;

    @GetMapping("queue/create")
    public InjectionQueueDto createQueue(Principal principal) {
        var queue = queueService.createQueue(asUser(principal));
        return toDto(queue);
    }

    @PostMapping("queue/remove")
    public void removeQueue(@RequestParam Integer queueId, Principal principal) {
        queueService.removeQueue(queueId, asUser(principal));
    }

    @GetMapping("queue/load/headers")
    public List<InjectionQueueHeaderDto> getQueues(Principal principal) {
        return queueService.getUserQueues(asUser(principal)).stream()
            .map(this::toHeader)
            .collect(Collectors.toList());
    }

    @GetMapping("queue/load")
    public InjectionQueueDto loadQueue(@RequestParam Integer queueId, Principal principal) {
        var queue = queueService.loadQueue(queueId, asUser(principal));
        return toDto(queue);
    }

    @PostMapping("queue/inject/all")
    public void injectAll(@RequestParam Integer queueId, Principal principal) {
        queueService.injectAll(queueId, this::send, asUser(principal));
    }

    @PostMapping("queue/clear")
    public void clearQueue(@RequestParam Integer queueId, Principal principal) {
        var queue = queueService.clearQueue(queueId, asUser(principal));
        send(queue);
    }

    @PostMapping("queue/name/change")
    public void changeQueueName(@RequestParam Integer queueId, @RequestParam String name, Principal principal) {
        var queue = queueService.changeQueueName(queueId, name, asUser(principal));
        send(queue);
    }

    @PostMapping("create")
    public void createInjections(@RequestParam Integer queueId, @RequestParam Integer count, Principal principal) {
        var change = queueService.createInjections(queueId, count, asUser(principal));
        send(change);
    }

    @PostMapping("create/from/template")
    public void createFromTemplate(@RequestParam Integer queueId, @RequestParam MultipartFile file, Principal principal) {
        var templateSource = sourceService.createFileSource(file);
        var change = queueService.createFromTemplate(queueId, templateSource, asUser(principal));
        send(change);
    }

    @PostMapping("upload/data/file")
    public void uploadDataFile(@RequestParam Integer injectionId, @RequestParam MultipartFile file, Principal principal) {
        var user = asUser(principal);

        constraints.checkFileSize(user, file);

        var source = sourceService.createFileSource(file);
        var change = queueService.setDataSource(injectionId, source, user);
        send(change);
    }

    @PostMapping("upload/template/file")
    public void uploadTemplateFile(@RequestParam Integer injectionId, @RequestParam MultipartFile file, Principal principal) {
        var user = asUser(principal);

        constraints.checkFileSize(user, file);

        var source = sourceService.createFileSource(file);
        var change = queueService.setTemplateSource(injectionId, source, user);
        send(change);
    }

    @PostMapping("upload/data")
    public void uploadDataSource(@RequestParam Integer injectionId, @RequestBody SourceDto sourceDto, Principal principal) {
        var source = fromDto(sourceDto);
        var change = queueService.setDataSource(injectionId, source, asUser(principal));
        send(change);
    }

    @PostMapping("upload/template")
    public void uploadTemplateSource(@RequestParam Integer injectionId, @RequestBody SourceDto sourceDto, Principal principal) {
        var source = fromDto(sourceDto);
        var change = queueService.setTemplateSource(injectionId, source, asUser(principal));
        send(change);
    }

    @PostMapping("inject")
    public void inject(@RequestParam Integer injectionId, Principal principal) {
        var change = queueService.inject(injectionId, asUser(principal));
        send(change);
    }

    @PostMapping("validate/template")
    public ResponseEntity<byte[]> validateTemplate(@RequestParam Integer injectionId, Principal principal) {
        var validated = queueService.validate(injectionId, asUser(principal));
        return sourceService.download(validated);
    }

    @PostMapping("copy")
    public void copy(@RequestParam Integer injectionId, Principal principal) {
        var change = queueService.copy(injectionId, asUser(principal));
        send(change);
    }

    @PostMapping("remove")
    public void remove(@RequestParam Integer injectionId, Principal principal) {
        var change = queueService.remove(injectionId, asUser(principal));
        send(change);
    }

    @PostMapping("move/injection")
    public void moveInjection(@RequestParam Integer queueId,
                              @RequestParam Integer fromOrderId,
                              @RequestParam Integer toOrderId,
                              Principal principal) {
        var change = queueService.moveInjection(queueId, fromOrderId, toOrderId, asUser(principal));
        send(change);
    }

    @GetMapping("result/download")
    @ResponseBody
    public ResponseEntity<byte[]> downloadResult(@RequestParam Integer injectionId, Principal principal) {
        Source resultSource = queueService.getResultSource(injectionId, asUser(principal));
        return sourceService.download(resultSource);
    }

    @PostMapping("result/name/edit")
    public void editResultName(@RequestParam Integer injectionId, @RequestParam String name, Principal principal) {
        var change = queueService.setPreferredResultName(injectionId, name, asUser(principal));
        send(change);
    }

    @PostMapping("output/format/change")
    public void changeOutputFormat(@RequestParam Integer injectionId, @RequestParam DocumentFormat format, Principal principal) {
        var change = queueService.setOutputFormat(injectionId, format, asUser(principal));
        send(change);
    }

    private void send(InjectionQueue.Change change) {
        send(toMessage(change));
    }

    private void send(InjectionQueue queue) {
        send(toMessage(queue));
    }

    private void send(QueueMessage message) {
        ws.sendQueue(message);
    }

    private QueueMessage toMessage(InjectionQueue.Change change) {
        return conversionService.convert(change, QueueMessage.class);
    }

    private QueueMessage toMessage(InjectionQueue queue) {
        return conversionService.convert(queue, QueueMessage.class);
    }

    private InjectionQueueHeaderDto toHeader(InjectionQueue queue) {
        return conversionService.convert(queue, InjectionQueueHeaderDto.class);
    }

    private InjectionQueueDto toDto(InjectionQueue queue) {
        return conversionService.convert(queue, InjectionQueueDto.class);
    }

    private Source fromDto(SourceDto sourceDto) {
        return conversionService.convert(sourceDto, Source.class);
    }

    private User asUser(Principal principal) {
        return ((TokenAuthentication) principal).getPrincipal();
    }
}

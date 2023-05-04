package by.varyvoda.corvus.app.controller;

import by.varyvoda.corvus.app.model.injection.InjectionQueue;
import by.varyvoda.corvus.app.model.source.Source;
import by.varyvoda.corvus.app.model.websocket.QueueMessage;
import by.varyvoda.corvus.app.service.injection.InjectionService;
import by.varyvoda.corvus.app.service.source.SourceService;
import by.varyvoda.corvus.app.service.websocket.WebSocketSendService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.convert.ConversionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("api/injection")
public class InjectionController {

    private final InjectionService queueService;
    private final SourceService sourceService;
    private final ConversionService conversionService;
    private final WebSocketSendService ws;

    @PostMapping("queue/create")
    public void createQueue() {
        var queue = queueService.createQueue();
        send(queue);
    }

    @PostMapping("queue/load")
    public void loadQueue(@RequestParam Integer queueId) {
        var queue = queueService.ensureQueue(queueId);
        send(queue);
    }

    @PostMapping("queue/clear")
    public void clearQueue(@RequestParam Integer queueId) {
        var queue = queueService.clearQueue(queueId);
        send(queue);
    }

    @PostMapping("create")
    public void createInjection(@RequestParam Integer queueId, @RequestParam Integer count) {
        var change = queueService.createInjection(queueId, count);
        send(change);
    }

    @PostMapping("upload/data")
    public void uploadDataFile(@RequestParam Integer injectionId, @RequestParam MultipartFile file) {
        var source = sourceService.createFileSource(file);
        var change = queueService.setDataSource(injectionId, source);
        send(change);
    }

    @PostMapping("upload/template")
    public void uploadTemplateFile(@RequestParam Integer injectionId, @RequestParam MultipartFile file) {
        var source = sourceService.createFileSource(file);
        var change = queueService.setTemplateSource(injectionId, source);
        send(change);
    }

    @PostMapping("inject")
    public void inject(@RequestParam Integer injectionId) {
        var change = queueService.inject(injectionId);
        send(change);
    }

    @PostMapping("remove")
    public void remove(@RequestParam Integer injectionId) {
        var change = queueService.remove(injectionId);
        send(change);
    }

    @GetMapping("download/result")
    @ResponseBody
    public ResponseEntity<byte[]> downloadResult(@RequestParam Integer injectionId) {
        Source resultSource = queueService.getResultSource(injectionId);
        return sourceService.download(resultSource);
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
}

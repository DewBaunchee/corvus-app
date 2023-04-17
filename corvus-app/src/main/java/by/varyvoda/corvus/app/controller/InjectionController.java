package by.varyvoda.corvus.app.controller;

import by.varyvoda.corvus.app.model.injection.InjectionQueue;
import by.varyvoda.corvus.app.model.source.FileSource;
import by.varyvoda.corvus.app.model.websocket.QueueMessage;
import by.varyvoda.corvus.app.service.injection.InjectionService;
import by.varyvoda.corvus.app.service.websocket.WebSocketSendService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.server.MimeMappings;
import org.springframework.core.convert.ConversionService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("api/injection")
public class InjectionController {

    private final InjectionService queueService;

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
    public void uploadData(@RequestParam Integer injectionId, @RequestParam MultipartFile file) {
        var change = queueService.uploadData(injectionId, file);
        send(change);
    }

    @PostMapping("upload/template")
    public void uploadFile(@RequestParam Integer injectionId, @RequestParam MultipartFile file) {
        var change = queueService.uploadTemplate(injectionId, file);
        send(change);
    }

    @PostMapping("inject")
    public void inject(@RequestParam Integer injectionId) {
        var change = queueService.inject(injectionId);
        send(change);
    }

    @GetMapping("download/result")
    @ResponseBody
    public ResponseEntity<byte[]> downloadFile(@RequestParam Integer injectionId) {
        FileSource file = queueService.getResultSource(injectionId);

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_TYPE, MimeMappings.DEFAULT.get(file.getExtension()))
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
            .body(file.getData());
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

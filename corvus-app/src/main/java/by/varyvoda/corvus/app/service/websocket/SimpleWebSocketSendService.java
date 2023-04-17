package by.varyvoda.corvus.app.service.websocket;

import by.varyvoda.corvus.app.model.websocket.QueueMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SimpleWebSocketSendService implements WebSocketSendService {

    private final SimpMessagingTemplate sender;

    @Override
    public void sendQueue(QueueMessage message) {
        sender.convertAndSend("/injection-queue", message);
    }
}

package by.varyvoda.corvus.app.service.websocket;

import by.varyvoda.corvus.app.model.websocket.QueueMessage;

public interface WebSocketSendService {

    void sendQueue(QueueMessage message);
}

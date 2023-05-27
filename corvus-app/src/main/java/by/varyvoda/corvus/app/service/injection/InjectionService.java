package by.varyvoda.corvus.app.service.injection;

import by.varyvoda.corvus.api.format.DocumentFormat;
import by.varyvoda.corvus.app.model.injection.InjectionQueue;
import by.varyvoda.corvus.app.model.source.Source;
import by.varyvoda.corvus.app.model.user.User;

import java.util.List;
import java.util.function.Consumer;

public interface InjectionService {

    InjectionQueue loadQueue(Integer id, User user);

    List<InjectionQueue> getUserQueues(User user);

    void injectAll(Integer queueId, Consumer<InjectionQueue.Change> progressConsumer, User user);

    InjectionQueue createQueue(User user);

    void removeQueue(Integer queueId, User user);

    InjectionQueue clearQueue(Integer queueId, User user);

    InjectionQueue.Change changeQueueName(Integer queueId, String name, User user);

    InjectionQueue.Change moveInjection(Integer queueId, Integer fromOrderId, Integer toOrderId, User user);

    InjectionQueue.Change createInjections(Integer queueId, int count, User user);

    InjectionQueue.Change setDataSource(Integer injectionId, Source source, User user);

    InjectionQueue.Change setTemplateSource(Integer injectionId, Source source, User user);

    InjectionQueue.Change setPreferredResultName(Integer injectionId, String name, User user);

    InjectionQueue.Change setOutputFormat(Integer injectionId, DocumentFormat format, User user);

    InjectionQueue.Change inject(Integer injectionId, User user);

    InjectionQueue.Change copy(Integer injectionId, User user);

    InjectionQueue.Change remove(Integer injectionId, User user);

    Source getResultSource(Integer injectionId, User user);
}

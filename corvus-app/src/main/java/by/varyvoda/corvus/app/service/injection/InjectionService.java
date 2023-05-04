package by.varyvoda.corvus.app.service.injection;

import by.varyvoda.corvus.app.model.injection.InjectionQueue;
import by.varyvoda.corvus.app.model.source.Source;

public interface InjectionService {

    InjectionQueue ensureQueue(Integer id);

    InjectionQueue getQueue(Integer id);

    InjectionQueue getQueueOrNull(Integer id);

    InjectionQueue createQueue();

    InjectionQueue clearQueue(Integer queueId);

    InjectionQueue.Change createInjection(Integer queueId, int count);

    InjectionQueue.Change setDataSource(Integer injectionId, Source source);

    InjectionQueue.Change setTemplateSource(Integer injectionId, Source source);

    InjectionQueue.Change inject(Integer injectionId);

    InjectionQueue.Change remove(Integer injectionId);

    Source getResultSource(Integer injectionId);

}

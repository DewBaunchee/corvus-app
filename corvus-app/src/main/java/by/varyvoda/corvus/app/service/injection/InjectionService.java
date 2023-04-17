package by.varyvoda.corvus.app.service.injection;

import by.varyvoda.corvus.app.model.injection.InjectionQueue;
import by.varyvoda.corvus.app.model.source.FileSource;
import org.springframework.web.multipart.MultipartFile;

public interface InjectionService {

    InjectionQueue ensureQueue(Integer id);

    InjectionQueue getQueue(Integer id);

    InjectionQueue getQueueOrNull(Integer id);

    InjectionQueue createQueue();

    InjectionQueue clearQueue(Integer queueId);

    InjectionQueue.Change createInjection(Integer queueId, int count);

    InjectionQueue.Change uploadData(Integer injectionId, MultipartFile file);

    InjectionQueue.Change uploadTemplate(Integer injectionId, MultipartFile file);

    InjectionQueue.Change inject(Integer injectionId);

    FileSource getResultSource(Integer injectionId);
}

package by.varyvoda.corvus.app.service.injection;

import by.varyvoda.corvus.api.format.DocumentFormat;
import by.varyvoda.corvus.api.request.InjectionRequest;
import by.varyvoda.corvus.api.response.InjectorResponse;
import by.varyvoda.corvus.app.model.injection.Injection;
import by.varyvoda.corvus.app.model.injection.InjectionQueue;
import by.varyvoda.corvus.app.model.injection.InjectionStatus;
import by.varyvoda.corvus.app.model.source.FileSource;
import by.varyvoda.corvus.app.model.source.Source;
import by.varyvoda.corvus.app.repository.InjectionQueueRepository;
import by.varyvoda.corvus.app.repository.InjectionRepository;
import by.varyvoda.corvus.app.service.injector.InjectorClient;
import by.varyvoda.corvus.app.service.source.SourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class RepositoryInjectionService implements InjectionService {

    private final InjectionQueueRepository queueRepository;

    private final InjectionRepository injectionRepository;

    private final SourceService sourceService;

    private final InjectorClient injector;

    @Override
    public InjectionQueue ensureQueue(Integer id) {
        var queue = getQueueOrNull(id);
        if (queue != null) return queue;
        return createQueue();
    }

    @Override
    public InjectionQueue getQueue(Integer id) {
        return queueRepository.getById(id);
    }

    @Override
    public InjectionQueue getQueueOrNull(Integer id) {
        return queueRepository.getByIdOrNull(id);
    }

    @Override
    public InjectionQueue createQueue() {
        var queue = new InjectionQueue();
        queueRepository.save(queue);
        return queue;
    }

    @Override
    public InjectionQueue clearQueue(Integer queueId) {
        var queue = getQueueOrNull(queueId);
        if (queue == null) return null;

        queue.getInjections().clear();
        queue.setStatus(InjectionStatus.EMPTY);
        queueRepository.save(queue);

        return queue;
    }

    @Override
    public InjectionQueue.Change createInjection(Integer queueId, int count) {
        var queue = getQueue(queueId);

        List<Injection> createdInjections = new ArrayList<>(count);
        for (int i = 0; i < count; i++) {
            Injection injection = new Injection();

            injection.setQueue(queue);

            createdInjections.add(injection);
            queue.getInjections().add(injection);
        }

        updateStatus(queue);

        return InjectionQueue.Change.startBuilding(queue)
            .addedInjections(createdInjections)
            .build();
    }

    @Override
    public InjectionQueue.Change setDataSource(Integer injectionId, Source source) {
        var injection = injectionRepository.getById(injectionId);
        injection.setDataSource(source);
        updateStatus(injection);
        updateStatus(injection.getQueue());
        injectionRepository.save(injection);

        return InjectionQueue.Change.startBuilding(injection.getQueue())
            .updatedInjections(List.of(injection))
            .build();
    }

    @Override
    public InjectionQueue.Change setTemplateSource(Integer injectionId, Source source) {
        var injection = injectionRepository.getById(injectionId);
        injection.setTemplateSource(source);
        updateStatus(injection);
        updateStatus(injection.getQueue());
        injectionRepository.save(injection);

        return InjectionQueue.Change.startBuilding(injection.getQueue())
            .updatedInjections(List.of(injection))
            .build();
    }

    @Override
    public InjectionQueue.Change inject(Integer injectionId) {
        Injection injection = injectionRepository.getByIdOrNull(injectionId);

        if (injection == null)
            throw new RuntimeException("Injection is not found with id: " + injectionId);

        if (injection.getStatus() != InjectionStatus.READY)
            throw new RuntimeException("Injection is not ready");

        InjectorResponse response = injector.inject(
            InjectionRequest.builder()
                .data(sourceService.loadData(injection.getDataSource()))
                .template(sourceService.loadTemplate(injection.getTemplateSource()))
                .outputFormat(DocumentFormat.DOCX)
                .build()
        );

        FileSource resultSource = new FileSource();
        resultSource.setName(injection.getPreferredResultName());
        resultSource.guessExtension();
        resultSource.setContent(response.getDocument());
        injection.setResultSource(resultSource);

        injection.setStatus(InjectionStatus.SUCCESS);
        updateStatus(injection.getQueue());

        injectionRepository.save(injection);

        return InjectionQueue.Change.startBuilding(injection.getQueue())
            .updatedInjections(List.of(injection))
            .build();
    }

    @Override
    public InjectionQueue.Change remove(Integer injectionId) {
        Injection injection = injectionRepository.getByIdOrNull(injectionId);
        if (injection == null) throw new NullPointerException("Injection with id " + injectionId + " is not found.");

        InjectionQueue queue = injection.getQueue();
        injectionRepository.delete(injection);

        return InjectionQueue.Change.startBuilding(queue)
            .removedInjections(List.of(injection))
            .build();
    }

    @Override
    public Source getResultSource(Integer injectionId) {
        Injection injection = injectionRepository.getById(injectionId);
        return injection.getResultSource();
    }

    private void updateStatus(InjectionQueue queue) {
        InjectionStatus currentStatus = queue.getStatus();
        InjectionStatus calculatedStatus = calculateStatus(queue);

        if (currentStatus == calculatedStatus) return;

        queue.setStatus(calculatedStatus);
    }

    private InjectionStatus calculateStatus(InjectionQueue queue) {
        Map<InjectionStatus, List<Injection>> statusCountMap =
            queue.getInjections().stream()
                .collect(Collectors.groupingBy(Injection::getStatus));

        if (statusCountMap.isEmpty())
            return InjectionStatus.EMPTY;

        if (statusCountMap.containsKey(InjectionStatus.ERROR))
            return InjectionStatus.ERROR;

        if (statusCountMap.containsKey(InjectionStatus.READY))
            return InjectionStatus.READY;

        if (statusCountMap.containsKey(InjectionStatus.EMPTY))
            return InjectionStatus.EMPTY;

        return InjectionStatus.SUCCESS;
    }

    private void updateStatus(Injection injection) {
        InjectionStatus currentStatus = injection.getStatus();
        InjectionStatus calculatedStatus = calculateStatus(injection);

        if (currentStatus == calculatedStatus) return;

        injection.setStatus(calculatedStatus);
    }

    private InjectionStatus calculateStatus(Injection injection) {
        if (injection.getResultSource() != null)
            return InjectionStatus.SUCCESS;
        if (injection.getDataSource() != null && injection.getTemplateSource() != null)
            return InjectionStatus.READY;
        return InjectionStatus.EMPTY;
    }
}

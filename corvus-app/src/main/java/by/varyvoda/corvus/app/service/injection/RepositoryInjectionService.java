package by.varyvoda.corvus.app.service.injection;

import by.varyvoda.corvus.api.format.DocumentFormat;
import by.varyvoda.corvus.api.request.InjectionRequest;
import by.varyvoda.corvus.api.response.InjectorResponse;
import by.varyvoda.corvus.api.value.object.ObjectValueDescriptor;
import by.varyvoda.corvus.app.model.exception.CorvusException;
import by.varyvoda.corvus.app.model.exception.ForbiddenException;
import by.varyvoda.corvus.app.model.injection.Injection;
import by.varyvoda.corvus.app.model.injection.InjectionQueue;
import by.varyvoda.corvus.app.model.injection.InjectionStatus;
import by.varyvoda.corvus.app.model.source.FileSource;
import by.varyvoda.corvus.app.model.source.Source;
import by.varyvoda.corvus.app.model.user.User;
import by.varyvoda.corvus.app.repository.InjectionQueueRepository;
import by.varyvoda.corvus.app.repository.InjectionRepository;
import by.varyvoda.corvus.app.service.InjectorService;
import by.varyvoda.corvus.app.service.source.SourceService;
import by.varyvoda.corvus.app.service.subscription.SubscriptionConstraintsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Consumer;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class RepositoryInjectionService implements InjectionService {

    private final SubscriptionConstraintsService constraints;
    private final InjectionQueueRepository queueRepository;
    private final InjectionRepository injectionRepository;
    private final SourceService sourceService;
    private final InjectorService injector;

    @Override
    public InjectionQueue loadQueue(Integer id, User user) {
        var queue = getQueue(id);
        checkOwner(queue, user);
        return queue;
    }

    @Override
    public List<InjectionQueue> getUserQueues(User user) {
        var queues = queueRepository.getAllByUser(user);
        if (queues.isEmpty()) queues.add(createQueue(user));
        return queues;
    }

    @Override
    @Transactional(propagation = Propagation.NEVER)
    public void injectAll(Integer queueId, Consumer<InjectionQueue.Change> progressConsumer, User user) {
        var queue = getQueue(queueId);
        checkOwner(queue, user);
        queue.getInjections().stream()
            .filter(injection -> injection.getStatus() == InjectionStatus.READY)
            .sorted(Comparator.comparing(Injection::getOrderId))
            .forEach(injection -> {
                var change = inject(injection.getId(), user);
                try {
                    progressConsumer.accept(change);
                } catch (Exception ignored) {
                    // ignored
                }
            });
    }

    private InjectionQueue getQueue(Integer id) {
        return queueRepository.getById(id);
    }

    private InjectionQueue getQueueOrNull(Integer id) {
        return queueRepository.getByIdOrNull(id);
    }

    @Override
    public InjectionQueue createQueue(User user) {
        constraints.checkQueueCreation(user);

        var queue = new InjectionQueue();
        var queueCount = queueRepository.countByUser(user);
        var name = "";
        do {
            name = "Queue-" + (++queueCount);
        } while (queueRepository.existsByUserAndName(user, name));
        queue.setName(name);
        queue.setUser(user);
        queueRepository.save(queue);
        return queue;
    }

    @Override
    public void removeQueue(Integer queueId, User user) {
        var queue = getQueue(queueId);
        checkOwner(queue, user);
        removeSources(queue);
        queueRepository.delete(queue);
    }

    @Override
    public InjectionQueue clearQueue(Integer queueId, User user) {
        var queue = getQueueOrNull(queueId);
        if (queue == null) return null;

        checkOwner(queue, user);

        removeSources(queue);
        queue.getInjections().clear();
        queue.setStatus(InjectionStatus.EMPTY);
        queueRepository.save(queue);

        return queue;
    }

    @Override
    public InjectionQueue.Change changeQueueName(Integer queueId, String name, User user) {
        var queue = getQueueOrNull(queueId);
        if (queue == null) return null;

        checkOwner(queue, user);

        queue.setName(name);
        queueRepository.save(queue);

        return InjectionQueue.Change.startBuilding(queue)
            .name(name)
            .build();
    }

    @Override
    public InjectionQueue.Change moveInjection(Integer queueId, Integer fromOrderId, Integer toOrderId, User user) {
        if (fromOrderId.equals(toOrderId)) return InjectionQueue.Change.empty();

        var queue = getQueue(queueId);
        checkOwner(queue, user);

        var minOrderId = Math.min(fromOrderId, toOrderId);
        var maxOrderId = Math.max(fromOrderId, toOrderId);

        Injection movedInjection = null;
        List<Injection> affectedInjections = new ArrayList<>();
        for (Injection injection : queue.getInjections()) {
            var orderId = injection.getOrderId();
            if (Objects.equals(orderId, fromOrderId)) {
                movedInjection = injection;
            } else if (orderId >= minOrderId && orderId <= maxOrderId) {
                affectedInjections.add(injection);
            }
        }

        int shift = fromOrderId < toOrderId ? -1 : 1;
        affectedInjections.forEach(injection -> injection.setOrderId(injection.getOrderId() + shift));
        movedInjection.setOrderId(toOrderId);

        queueRepository.save(queue);

        affectedInjections.add(movedInjection);

        return InjectionQueue.Change.startBuilding(queue)
            .updatedInjections(affectedInjections)
            .build();
    }

    @Override
    public InjectionQueue.Change createInjections(Integer queueId, int count, User user) {
        constraints.checkInjectionCreation(user, queueId, count);

        var queue = getQueue(queueId);
        checkOwner(queue, user);

        int existInjectionCount = queue.getInjections().size();
        List<Injection> createdInjections = new ArrayList<>(count);
        for (int i = 0; i < count; i++) {
            Injection injection = new Injection();

            injection.setOrderId(existInjectionCount + i);
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
    public InjectionQueue.Change createFromTemplate(Integer queueId, Source templateSource, User user) {
        constraints.checkInjectionCreation(user, queueId, 1);

        var queue = getQueue(queueId);
        checkOwner(queue, user);

        int existInjectionCount = queue.getInjections().size();
        Injection injection = new Injection();

        injection.setOrderId(existInjectionCount);
        injection.setQueue(queue);
        injection.setTemplateSource(templateSource);

        queue.getInjections().add(injection);

        updateStatus(queue);

        return InjectionQueue.Change.startBuilding(queue)
            .addedInjections(List.of(injection))
            .build();
    }

    @Override
    public InjectionQueue.Change setDataSource(Integer injectionId, Source source, User user) {
        var injection = injectionRepository.getById(injectionId);
        checkOwner(injection, user);
        remove(injection.getDataSource());
        injection.setDataSource(source);
        updateStatus(injection);
        updateStatus(injection.getQueue());
        injectionRepository.save(injection);

        return InjectionQueue.Change.startBuilding(injection.getQueue())
            .updatedInjections(List.of(injection))
            .build();
    }

    @Override
    public InjectionQueue.Change setTemplateSource(Integer injectionId, Source source, User user) {
        var injection = injectionRepository.getById(injectionId);
        checkOwner(injection, user);
        remove(injection.getTemplateSource());
        injection.setTemplateSource(source);
        updateStatus(injection);
        updateStatus(injection.getQueue());
        injectionRepository.save(injection);

        return InjectionQueue.Change.startBuilding(injection.getQueue())
            .updatedInjections(List.of(injection))
            .build();
    }

    @Override
    public InjectionQueue.Change setPreferredResultName(Integer injectionId, String name, User user) {
        var injection = injectionRepository.getById(injectionId);
        checkOwner(injection, user);

        if (injection.getResultSource() != null) return InjectionQueue.Change.empty();

        injection.setPreferredResultName(name);

        injectionRepository.save(injection);

        return InjectionQueue.Change.startBuilding(injection.getQueue())
            .updatedInjections(List.of(injection))
            .build();
    }

    @Override
    public InjectionQueue.Change setOutputFormat(Integer injectionId, DocumentFormat format, User user) {
        var injection = injectionRepository.getById(injectionId);
        checkOwner(injection, user);

        if (injection.getResultSource() != null) return InjectionQueue.Change.empty();

        injection.setOutputFormat(format);

        injectionRepository.save(injection);

        return InjectionQueue.Change.startBuilding(injection.getQueue())
            .updatedInjections(List.of(injection))
            .build();
    }

    @Override
    public InjectionQueue.Change inject(Integer injectionId, User user) {
        Injection injection = injectionRepository.getByIdOrNull(injectionId);

        if (injection == null)
            throw new CorvusException("Injection is not found with id: " + injectionId);

        checkOwner(injection, user);

        if (injection.getStatus() != InjectionStatus.READY)
            throw new CorvusException("Injection is not ready");

        DocumentFormat outputFormat = injection.getOutputFormat();
        InjectorResponse response = injector.inject(
            new InjectionRequest(
                sourceService.loadTemplate(injection.getTemplateSource()),
                sourceService.loadData(injection.getDataSource()),
                outputFormat
            )
        );

        FileSource resultSource = new FileSource();

        String resultName = injection.getPreferredResultName();
        String neededExtension = "." + outputFormat.getExtension();
        if (!resultName.endsWith(neededExtension)) resultName += neededExtension;

        resultSource.setName(resultName);
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
    public FileSource validate(Integer injectionId, User user) {
        Injection injection = injectionRepository.getByIdOrNull(injectionId);

        if (injection == null)
            throw new CorvusException("Injection is not found with id: " + injectionId);

        checkOwner(injection, user);

        var templateSource = injection.getTemplateSource();
        if (templateSource == null)
            throw new CorvusException("Cannot validate injection without template");
        var template = sourceService.loadTemplate(templateSource);

        var dataSource = injection.getDataSource();
        var data = dataSource == null ? ObjectValueDescriptor.empty() : sourceService.loadData(dataSource);

        InjectorResponse response = injector.validate(new InjectionRequest(template, data));

        FileSource validatedSource = new FileSource();
        validatedSource.setContent(response.getDocument());
        validatedSource.setName("Validated " + template.getName());
        validatedSource.guessExtension();

        return validatedSource;
    }

    @Override
    public InjectionQueue.Change copy(Integer injectionId, User user) {
        Injection copying = injectionRepository.getByIdOrNull(injectionId);
        if (copying == null) throw new CorvusException("Injection with id " + injectionId + " is not found.");

        checkOwner(copying, user);

        InjectionQueue queue = copying.getQueue();

        constraints.checkInjectionCreation(user, queue.getId(), 1);

        Injection copied = new Injection();

        copied.setQueue(copying.getQueue());
        copied.setDataSource(copying.getDataSource());
        copied.setTemplateSource(copying.getTemplateSource());
        copied.setOutputFormat(copying.getOutputFormat());
        copied.setPreferredResultName(copying.getPreferredResultName());

        copied.setOrderId(copying.getOrderId() + 1);
        var affected = queue.getInjections().stream()
            .filter(injection -> injection.getOrderId() > copying.getOrderId())
            .peek(injection -> injection.setOrderId(injection.getOrderId() + 1))
            .collect(Collectors.toList());
        queue.getInjections().add(copied);

        updateStatus(copied);
        updateStatus(queue);

        injectionRepository.save(copied);
        queueRepository.save(queue);

        return InjectionQueue.Change.startBuilding(queue)
            .addedInjections(List.of(copied))
            .updatedInjections(affected)
            .build();
    }

    @Override
    public InjectionQueue.Change remove(Integer injectionId, User user) {
        Injection injection = injectionRepository.getByIdOrNull(injectionId);
        if (injection == null) throw new CorvusException("Injection with id " + injectionId + " is not found.");

        checkOwner(injection, user);

        removeSources(injection);

        InjectionQueue queue = injection.getQueue();
        injectionRepository.delete(injection);

        queue.getInjections().remove(injection);

        updateStatus(queue);
        queueRepository.save(queue);

        return InjectionQueue.Change.startBuilding(queue)
            .removedInjections(List.of(injection))
            .build();
    }

    @Override
    public Source getResultSource(Integer injectionId, User user) {
        Injection injection = injectionRepository.getById(injectionId);
        checkOwner(injection, user);
        return injection.getResultSource();
    }

    private void removeSources(InjectionQueue queue) {
        queue.getInjections().forEach(this::removeSources);
    }

    private void removeSources(Injection injection) {
        remove(injection.getDataSource());
        remove(injection.getTemplateSource());
        remove(injection.getResultSource());
    }

    private void remove(Source source) {
        if (source == null) return;
        sourceService.removeSourceIfOneOrLessUses(source.getId());
    }

    private void checkOwner(InjectionQueue queue, User user) {
        if (!Objects.equals(queue.getUser().getId(), user.getId()))
            throw new ForbiddenException("Queue " + queue.getId() + " is not own by " + user.getUsername());
    }

    private void checkOwner(Injection injection, User user) {
        checkOwner(injection.getQueue(), user);
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

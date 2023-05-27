import {createReducer, on} from "@ngrx/store";
import {initialInjectionState, InjectionState} from "../state/injection-state";
import {InjectionQueueActions} from "../actions/injection-actions";
import {
    InjectionQueue,
    InjectionQueueModel,
    InjectionQueueOrHeader
} from "../../models/injection/injection-queue-model";
import {toObject} from "../../../base/util/functions";
import {InjectionModel} from "../../models/injection/injection-model";

const mapQueues = (
    state: InjectionState,
    queueId: number,
    mapper: (model: InjectionQueueModel) => InjectionQueueModel
): InjectionState => {
    const queues = {...state.queues};
    const targetQueue = queues[queueId];
    if (!("injections" in targetQueue)) throw new Error("Cannot map header");
    queues[queueId] = mapper(targetQueue);
    return {...state, queues};
};
const mapQueuesOrHeaders = (
    state: InjectionState,
    queueId: number,
    mapper: (model: InjectionQueueOrHeader) => InjectionQueueOrHeader
): InjectionState => {
    const queues = {...state.queues};
    queues[queueId] = mapper(queues[queueId]);
    return {...state, queues};
};
const calculateCurrentQueueId = (
    currentQueueId: number,
    queues: { [key: number]: InjectionQueueOrHeader },
    nextQueueId?: number
): number => {
    if (nextQueueId && queues[nextQueueId]) return nextQueueId;
    if (queues[currentQueueId]) return currentQueueId;
    return Object.values(queues)[0]?.id || -1;
};

const sortInjections = (injections: InjectionModel[]) =>
    injections.sort((a, b) => a.orderId - b.orderId);

export const injectionReducer = createReducer(
    initialInjectionState(),
    on(InjectionQueueActions.update, (state, {queue}): InjectionState => {
        return mapQueuesOrHeaders(state, queue.id, () => queue);
    }),
    on(InjectionQueueActions.setName, (state, {queueId, name}): InjectionState => {
        return mapQueues(state, queueId, model => ({...model, name}));
    }),
    on(InjectionQueueActions.setStatus, (state, {queueId, status}): InjectionState => {
        return mapQueues(state, queueId, model => ({...model, status}));
    }),
    on(InjectionQueueActions.addInjections, (state, {queueId, injections}): InjectionState => {
        return mapQueues(state, queueId, model => ({
            ...model,
            injections: sortInjections([
                ...model.injections,
                ...injections
            ])
        }));
    }),
    on(InjectionQueueActions.removeInjections, (state, {queueId, injections}): InjectionState => {
        const removedIds = injections.map(injection => injection.id);
        return mapQueues(state, queueId, model => ({
            ...model,
            injections: model.injections.filter(injection => !removedIds.includes(injection.id)),
        }));
    }),
    on(InjectionQueueActions.setInjections, (state, {queueId, injections}): InjectionState => {
        return mapQueues(state, queueId, model => ({
            ...model,
            injections: sortInjections(injections)
        }));
    }),
    on(InjectionQueueActions.updateInjections, (state, {queueId, injections}): InjectionState => {
        const updatedInjectionMap = InjectionQueue.createMap(injections);
        return mapQueues(state, queueId, model => ({
            ...model,
            injections: sortInjections(
                model.injections.map(injection =>
                    updatedInjectionMap.get(injection.id) || injection
                )
            )
        }));
    }),
    on(InjectionQueueActions.setQueues, (state, {queues}): InjectionState => {
        const queuesObject = toObject(queues, model => model.id);
        return {
            ...state,
            currentQueueId: calculateCurrentQueueId(state.currentQueueId, queuesObject),
            queues: queuesObject
        };
    }),
    on(InjectionQueueActions.addQueues, (state, {queues}): InjectionState => {
        const queuesObject = {
            ...state.queues,
            ...toObject(queues, model => model.id),
        };
        return {
            ...state,
            currentQueueId: calculateCurrentQueueId(state.currentQueueId, queuesObject),
            queues: queuesObject
        };
    }),
    on(InjectionQueueActions.removeQueuesState, (state, {queueIds}): InjectionState => {
        const queuesObject = {
            ...state.queues,
        };
        queueIds.forEach(id => delete queuesObject[id]);
        return {
            ...state,
            currentQueueId: calculateCurrentQueueId(state.currentQueueId, queuesObject),
            queues: queuesObject
        };
    }),
    on(InjectionQueueActions.changeCurrentQueue, (state, {queueId}): InjectionState => {
        return {
            ...state,
            currentQueueId: calculateCurrentQueueId(state.currentQueueId, state.queues, queueId),
        };
    }),
);

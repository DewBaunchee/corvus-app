import {AppState} from "../../../store/state/app-state";
import {createSelector} from "@ngrx/store";

export const selectInjectionState = (state: AppState) => state.injection;
export const selectQueues = createSelector(
    selectInjectionState,
    state => state.queues
);
export const selectCurrentQueueId = createSelector(
    selectInjectionState,
    state => state.currentQueueId
);
export const selectCurrentQueue = createSelector(
    selectQueues,
    selectCurrentQueueId,
    (queues, currentQueueId) => queues[currentQueueId]
);
export const selectQueueCount = createSelector(
    selectQueues,
    queues => Object.entries(queues).length
);
export const selectInjectionCount = (queueId: number) => createSelector(
    selectQueues,
    (queues) => {
        const queue = queues[queueId];
        return queue && "injections" in queue ? queue.injections.length : undefined;
    }
);

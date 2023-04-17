import {createReducer, on} from "@ngrx/store";
import {initialInjectionState} from "../state/injection-state";
import {InjectionQueueActions} from "../actions/injection-actions";
import {InjectionQueue} from "../../models/injection/injection-queue-model";

export const injectionReducer = createReducer(
    initialInjectionState(),
    on(InjectionQueueActions.setStatus, (state, {status}) => ({
        ...state,
        queue: {
            ...state.queue,
            status
        }
    })),
    on(InjectionQueueActions.addInjections, (state, {injections}) => ({
        ...state,
        queue: {
            ...state.queue,
            injections: [
                ...state.queue.injections,
                ...injections
            ]
        }
    })),
    on(InjectionQueueActions.setInjections, (state, {injections}) => ({
        ...state,
        queue: {
            ...state.queue,
            injections
        }
    })),
    on(InjectionQueueActions.updateInjections, (state, {injections}) => {
        const updatedInjectionMap = InjectionQueue.createMap(injections);
        return {
            ...state,
            queue: {
                ...state.queue,
                injections: state.queue.injections.map(injection =>
                    updatedInjectionMap.get(injection.id) || injection
                )
            }
        };
    }),
);

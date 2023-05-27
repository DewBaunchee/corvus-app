import {InjectionQueueOrHeader} from "../../models/injection/injection-queue-model";

export interface InjectionState {
    currentQueueId: number;
    queues: {
        [key: number]: InjectionQueueOrHeader;
    };
}

export const initialInjectionState: () => InjectionState =
    () => ({
        currentQueueId: -1,
        queues: {}
    });

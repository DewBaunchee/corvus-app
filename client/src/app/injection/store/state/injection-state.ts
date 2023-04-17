import {emptyInjectionQueue, InjectionQueueModel} from "../../models/injection/injection-queue-model";

export interface InjectionState {
    queue: InjectionQueueModel;
}

export const initialInjectionState: () => InjectionState =
    () => ({
        queue: emptyInjectionQueue()
    });

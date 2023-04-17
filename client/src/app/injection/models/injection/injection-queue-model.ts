import {InjectionStatus} from "./injection-status";
import {Injection, InjectionId, InjectionModel} from "./injection-model";
import {AppActions} from "../../../base/models/action/app-actions";


export interface InjectionQueueModel {
    id: number;
    status: InjectionStatus;
    injections: InjectionModel[];
}

export const emptyInjectionQueue: () => InjectionQueueModel =
    () => ({
        id: -1,
        status: InjectionStatus.EMPTY,
        injections: []
    });

export class InjectionQueue {

    constructor(
        public readonly model: InjectionQueueModel = emptyInjectionQueue(),
        public readonly injections: Injection[] = [],
        public readonly actions: AppActions = new AppActions()
    ) {
    }

    public static createMap(injections: InjectionModel[]): Map<InjectionId, InjectionModel> {
        return new Map(
            injections.map(injection => [injection.id, injection])
        );
    }

    public static fromModel(
        model: InjectionQueueModel,
        actions: AppActions,
        injectionMapper: (model: InjectionModel) => Injection
    ) {
        return new InjectionQueue(
            model,
            model.injections.map(injectionMapper),
            actions
        );
    }

    public getInjection(id: InjectionId) {
        return this.injections.find(injection => injection.model.id === id);
    }
}

import {InjectionStatus} from "./injection-status";
import {AppActions} from "../../../base/models/action/app-actions";
import {Source} from "../../../base/models/source/source";


export type InjectionId = number;

export interface InjectionModel {
    readonly id: InjectionId;
    readonly queueId: number;
    readonly orderId: number;
    readonly status: InjectionStatus;
    readonly dataSource: Source;
    readonly templateSource: Source;
}

export class Injection {

    constructor(
        public readonly model: InjectionModel,
        public readonly actions: AppActions
    ) {
    }
}

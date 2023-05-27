import {InjectionStatus} from "./injection-status";
import {AppActions} from "../../../base/models/action/app-actions";
import {Source} from "../../../base/models/source/source";
import {DocumentFormat} from "../../../base/models/document/document-format";


export type InjectionId = number;

export interface InjectionModel {
    readonly id: InjectionId;
    readonly queueId: number;
    readonly orderId: number;
    readonly status: InjectionStatus;
    readonly dataSource: Source;
    readonly templateSource: Source;
    readonly outputFormat: DocumentFormat;
    readonly preferredResultName: string;
}

export class Injection {

    constructor(
        public readonly model: InjectionModel,
        public readonly actions: AppActions,
        public readonly editable: boolean
    ) {
    }
}

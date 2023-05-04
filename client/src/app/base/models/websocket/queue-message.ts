import {InjectionStatus} from "../../../injection/models/injection/injection-status";
import {InjectionModel} from "../../../injection/models/injection/injection-model";

export interface QueueMessage {
    readonly queueId?: number;
    readonly status?: InjectionStatus;
    readonly injections?: InjectionModel[]
    readonly addedInjections?: InjectionModel[]
    readonly removedInjections?: InjectionModel[]
    readonly updatedInjections?: InjectionModel[]
}

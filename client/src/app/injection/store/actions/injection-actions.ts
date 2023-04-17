import {createActionGroup, props} from "@ngrx/store";
import {EmptyProps} from "../../../base/util/ngrx";
import {InjectionId, InjectionModel} from "../../models/injection/injection-model";
import {registerActions} from "../../../store/actions/app-actions";
import {InjectionQueueModel} from "../../models/injection/injection-queue-model";
import {InjectionStatus} from "../../models/injection/injection-status";
import {Source} from "../../models/source/source";

export const InjectionQueueActions = createActionGroup({
    source: "Injection Queue",
    events: {
        "Create Queue": props<EmptyProps>(),
        "Load Queue": props<EmptyProps>(),
        "Set Status": props<{ queueId: number, status: InjectionStatus }>(),
        "Set Injections": props<{ queueId: number, injections: InjectionModel[] }>(),
        "Add Injections": props<{ queueId: number, injections: InjectionModel[] }>(),
        "Update Injections": props<{ queueId: number, injections: InjectionModel[] }>(),
        "Update": props<{ queue: InjectionQueueModel }>(),
        "Clear": props<EmptyProps>(),
        "Inject All": props<EmptyProps>(),
        "Create Injections": props<{ count: number }>(),
    },
});

export const InjectionActions = createActionGroup({
    source: "Injection",
    events: {
        "Inject": props<{ injectionId: InjectionId }>(),
        "Download Result": props<{ injectionId: InjectionId }>(),
        "Move": props<{ injectionId: InjectionId, newOrderId: number }>(),
        "Upload Data Source": props<{ injectionId: InjectionId, file: File }>(),
        "Upload Template Source": props<{ injectionId: InjectionId, file: File }>(),
        "Set Data Source": props<{ injectionId: InjectionId, source: Source }>(),
        "Set Template Source": props<{ injectionId: InjectionId, source: Source }>(),
    },
});

registerActions(InjectionQueueActions);
registerActions(InjectionActions);

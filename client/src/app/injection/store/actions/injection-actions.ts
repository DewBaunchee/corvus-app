import {createActionGroup, props} from "@ngrx/store";
import {EmptyProps} from "../../../base/util/ngrx";
import {InjectionId, InjectionModel} from "../../models/injection/injection-model";
import {registerActions} from "../../../store/actions/app-actions";
import {InjectionQueueModel, InjectionQueueOrHeader} from "../../models/injection/injection-queue-model";
import {InjectionStatus} from "../../models/injection/injection-status";
import {Source} from "../../../base/models/source/source";
import {DocumentFormat} from "../../../base/models/document/document-format";

export type QueueIdProps = { queueId: number };

export const InjectionQueueActions = createActionGroup({
    source: "Injection Queue",
    events: {
        "Create Queue": props<EmptyProps>(),
        "Load All Queues": props<EmptyProps>(),
        "Set Queues": props<{ queues: InjectionQueueOrHeader[] }>(),
        "Add Queues": props<{ queues: InjectionQueueOrHeader[] }>(),
        "Remove Queue": props<QueueIdProps>(),
        "Remove Queues State": props<{ queueIds: number[] }>(),
        "Load Queue": props<QueueIdProps>(),
        "Update": props<{ queue: InjectionQueueModel }>(),
        "Change Name": props<QueueIdProps & { name: string }>(),
        "Set Name": props<QueueIdProps & { name: string }>(),
        "Set Status": props<QueueIdProps & { status: InjectionStatus }>(),
        "Set Injections": props<QueueIdProps & { injections: InjectionModel[] }>(),
        "Add Injections": props<QueueIdProps & { injections: InjectionModel[] }>(),
        "Remove Injections": props<QueueIdProps & { injections: InjectionModel[] }>(),
        "Update Injections": props<QueueIdProps & { injections: InjectionModel[] }>(),
        "Clear": props<QueueIdProps>(),
        "Inject All": props<QueueIdProps>(),
        "Change Current Queue": props<QueueIdProps>(),
        "Create Injections": props<QueueIdProps & { count: number }>(),
        "Create From Templates": props<QueueIdProps & { files: File[] }>(),
        "Move Injection": props<QueueIdProps & { fromOrderId: number; toOrderId: number }>()
    },
});

export type InjectionIdProps = { injectionId: InjectionId };

export const InjectionActions = createActionGroup({
    source: "Injection",
    events: {
        "Copy": props<InjectionIdProps>(),
        "Remove": props<InjectionIdProps>(),
        "Move": props<InjectionIdProps & { newOrderId: number }>(),
        "Upload Data File": props<InjectionIdProps & { file: File }>(),
        "Upload Template File": props<InjectionIdProps & { file: File }>(),
        "Upload Data Source": props<InjectionIdProps & { source: Source }>(),
        "Upload Template Source": props<InjectionIdProps & { source: Source }>(),
        "Set Data Source": props<InjectionIdProps & { source: Source }>(),
        "Set Template Source": props<InjectionIdProps & { source: Source }>(),
        "Change Output Format": props<InjectionIdProps & { format: DocumentFormat }>(),
        "Edit Result Name": props<InjectionIdProps & { name: string }>(),
        "Inject": props<InjectionIdProps>(),
        "Validate Template": props<{ injectionId: number }>(),
        "Download Result": props<InjectionIdProps>(),
    },
});

registerActions(InjectionQueueActions);
registerActions(InjectionActions);

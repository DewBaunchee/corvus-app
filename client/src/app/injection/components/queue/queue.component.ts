import {Component, Input} from "@angular/core";
import {InjectionQueue} from "../../models/injection/injection-queue-model";
import {InjectionActions, InjectionQueueActions} from "../../store/actions/injection-actions";
import {AppState} from "../../../store/state/app-state";
import {Store} from "@ngrx/store";
import {FileDecorator} from "../../../base/models/file/file-decorator";
import {InjectionId} from "../../models/injection/injection-model";
import {SourceActions} from "../../../base/store/actions/source-actions";

@Component({
    selector: "queue",
    templateUrl: "./queue.component.html",
    styleUrls: ["./queue.component.scss"]
})
export class QueueComponent {

    @Input()
    public queue: InjectionQueue = new InjectionQueue();

    constructor(private readonly store: Store<AppState>) {
    }

    public get actions() {
        return this.queue.actions;
    }

    public get model() {
        return this.queue.model;
    }

    public createInjection() {
        this.queue.actions.dispatch(this.store, InjectionQueueActions.createInjections);
    }

    public uploadData(injectionId: InjectionId, file: FileDecorator) {
        const injection = this.queue.getInjection(injectionId);

        if (!injection) return;

        this.store.dispatch(InjectionActions.uploadDataSource({injectionId, file: file.toFile()}));
    }

    public uploadTemplate(injectionId: InjectionId, file: FileDecorator) {
        const injection = this.queue.getInjection(injectionId);

        if (!injection) return;

        this.store.dispatch(InjectionActions.uploadTemplateSource({injectionId, file: file.toFile()}));
    }

    public downloadSource(id: number) {
        this.store.dispatch(SourceActions.download({id}));
    }
}

import {Component, Input} from "@angular/core";
import {InjectionQueue} from "../../models/injection/injection-queue-model";
import {InjectionActions, InjectionQueueActions} from "../../store/actions/injection-actions";
import {AppState} from "../../../store/state/app-state";
import {Store} from "@ngrx/store";
import {FileDecorator} from "../../../base/models/file/file-decorator";
import {Injection, InjectionId} from "../../models/injection/injection-model";
import {SourceActions} from "../../../base/store/source/actions/source-actions";
import {Source} from "../../../base/models/source/source";
import {DocumentFormat} from "../../../base/models/document/document-format";

@Component({
    selector: "queue",
    templateUrl: "./queue.component.html",
    styleUrls: ["./queue.component.scss"]
})
export class QueueComponent {

    @Input()
    public queue: InjectionQueue = new InjectionQueue();

    public readonly documentFormats: DocumentFormat[] = Object.values(DocumentFormat);

    private draggingIndex = -1;

    constructor(private readonly store: Store<AppState>) {
    }

    public get actions() {
        return this.queue.actions;
    }

    public get model() {
        return this.queue.model;
    }

    public createInjection() {
        this.queue.actions.activate(InjectionQueueActions.createInjections.type);
    }

    public uploadDataFile(injection: Injection, file: FileDecorator) {
        this.store.dispatch(InjectionActions.uploadDataFile({injectionId: injection.model.id, file: file.toFile()}));
    }

    public uploadTemplateFile(injection: Injection, file: FileDecorator) {
        this.store.dispatch(InjectionActions.uploadTemplateFile({
            injectionId: injection.model.id,
            file: file.toFile()
        }));
    }

    public uploadDataSource(injection: Injection, source: Source) {
        if (injection.model.dataSource) {
            source.id = injection.model.dataSource.id;
        }
        this.store.dispatch(InjectionActions.uploadDataSource({injectionId: injection.model.id, source}));
    }

    public uploadTemplateSource(injection: Injection, source: Source) {
        if (injection.model.templateSource) {
            source.id = injection.model.templateSource.id;
        }
        this.store.dispatch(InjectionActions.uploadDataSource({injectionId: injection.model.id, source}));
    }

    public downloadSource(id: number) {
        this.store.dispatch(SourceActions.download({id}));
    }

    public changeOutputFormat(injectionId: InjectionId, format: DocumentFormat) {
        this.store.dispatch(InjectionActions.changeOutputFormat({injectionId, format}));
    }

    public onDragStart(fromIndex: number): void {
        this.draggingIndex = fromIndex;
    }

    public onDragEnter(toIndex: number): void {
        if (this.draggingIndex === -1) return;
        if (this.draggingIndex !== toIndex) {
            const temp = this.queue.injections[this.draggingIndex];
            this.queue.injections[this.draggingIndex] = this.queue.injections[toIndex];
            this.queue.injections[toIndex] = temp;
            this.draggingIndex = toIndex;
        }
    }

    public onDragEnd(): void {
        const dragged: Injection | undefined = this.queue.injections[this.draggingIndex];
        const lastMoved: Injection | undefined = this.queue.injections[this.draggingIndex - 1];

        this.draggingIndex = -1;

        if (!dragged) return;

        this.store.dispatch(
            InjectionQueueActions.moveInjection({
                queueId: this.queue.model.id,
                fromOrderId: dragged.model.orderId,
                toOrderId: lastMoved?.model.orderId || -1,
            })
        );
    }
}

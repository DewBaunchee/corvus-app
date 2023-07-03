import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {InjectionActions, InjectionQueueActions} from "../actions/injection-actions";
import {combineLatest, exhaustMap, filter, map, mergeMap, pipe, switchMap} from "rxjs";
import {InjectionService} from "../../service/injection/injection.service";
import {NoAction} from "../../../store/actions/app-actions";
import {HttpEvent, HttpEventType, HttpProgressEvent} from "@angular/common/http";
import {createFileSource} from "../../../base/models/source/file-source";

@Injectable()
export class InjectionEffects {

    public readonly createQueue = createEffect(() => this.actions$.pipe(
        ofType(InjectionQueueActions.createQueue),
        exhaustMap(() =>
            this.injectionService.createQueue()
        ),
        map(model => InjectionQueueActions.addQueues({queues: [model]}))
    ));

    public readonly removeQueue = createEffect(() => this.actions$.pipe(
        ofType(InjectionQueueActions.removeQueue),
        exhaustMap(({queueId}) =>
            this.injectionService.removeQueue(queueId).pipe(
                map(() => InjectionQueueActions.removeQueuesState({queueIds: [queueId]}))
            )
        )
    ));

    public readonly loadAllQueues = createEffect(() => this.actions$.pipe(
        ofType(InjectionQueueActions.loadAllQueues),
        exhaustMap(() =>
            this.injectionService.loadHeaders()
        ),
        map(queues => InjectionQueueActions.setQueues({queues}))
    ));

    public readonly loadQueue = createEffect(() => this.actions$.pipe(
        ofType(InjectionQueueActions.loadQueue),
        exhaustMap(({queueId}) =>
            this.injectionService.loadQueue(queueId)
        ),
        map(queue => InjectionQueueActions.update({queue}))
    ));

    public readonly injectAll = createEffect(() => this.actions$.pipe(
        ofType(InjectionQueueActions.injectAll),
        exhaustMap(({queueId}) =>
            this.injectionService.injectAll(queueId)
        ),
        map(NoAction)
    ));

    public readonly createInjections = createEffect(() => this.actions$.pipe(
        ofType(InjectionQueueActions.createInjections),
        exhaustMap(({queueId, count}) =>
            this.injectionService.createInjections(queueId, count)
        ),
        map(NoAction)
    ));

    public readonly createFromTemplates = createEffect(() => this.actions$.pipe(
        ofType(InjectionQueueActions.createFromTemplates),
        switchMap(({queueId, files}) =>
            combineLatest(
                files.map(file =>
                    this.injectionService.createFromTemplate(queueId, file)
                )
            )
        ),
        map(NoAction)
    ));

    public readonly clearAll = createEffect(() => this.actions$.pipe(
        ofType(InjectionQueueActions.clear),
        exhaustMap(({queueId}) =>
            this.injectionService.clearQueue(queueId)
        ),
        map(NoAction)
    ));

    public readonly editName = createEffect(() => this.actions$.pipe(
        ofType(InjectionQueueActions.changeName),
        exhaustMap(({queueId, name}) =>
            this.injectionService.changeQueueName(queueId, name)
        ),
        map(NoAction)
    ));

    public readonly moveInjection = createEffect(() => this.actions$.pipe(
        ofType(InjectionQueueActions.moveInjection),
        exhaustMap(({queueId, fromOrderId, toOrderId}) =>
            this.injectionService.moveInjection(queueId, fromOrderId, toOrderId)
        ),
        map(NoAction)
    ));

    public readonly uploadDataFile = createEffect(() => this.actions$.pipe(
        ofType(InjectionActions.uploadDataFile),
        mergeMap(({injectionId, file}) =>
            this.injectionService.uploadDataFile(injectionId, file).pipe(
                this.mapToProgress(),
                map(progress =>
                    InjectionActions.setDataSource({
                        injectionId,
                        source: createFileSource(file, progress)
                    })
                )
            )
        ),
    ));

    public readonly uploadTemplateFile = createEffect(() => this.actions$.pipe(
        ofType(InjectionActions.uploadTemplateFile),
        mergeMap(({injectionId, file}) =>
            this.injectionService.uploadTemplateFile(injectionId, file).pipe(
                this.mapToProgress(),
                map(progress =>
                    InjectionActions.setTemplateSource({
                        injectionId,
                        source: createFileSource(file, progress)
                    })
                )
            )
        ),
        map(NoAction)
    ));

    public readonly uploadData = createEffect(() => this.actions$.pipe(
        ofType(InjectionActions.uploadDataSource),
        mergeMap(({injectionId, source}) =>
            this.injectionService.uploadDataSource(injectionId, source)
        ),
        map(NoAction)
    ));

    public readonly uploadTemplate = createEffect(() => this.actions$.pipe(
        ofType(InjectionActions.uploadTemplateSource),
        mergeMap(({injectionId, source}) =>
            this.injectionService.uploadTemplateSource(injectionId, source)
        ),
        map(NoAction)
    ));

    public readonly inject = createEffect(() => this.actions$.pipe(
        ofType(InjectionActions.inject),
        exhaustMap(({injectionId}) =>
            this.injectionService.inject(injectionId)
        ),
        map(NoAction)
    ));

    public readonly validateTemplate = createEffect(() => this.actions$.pipe(
        ofType(InjectionActions.validateTemplate),
        exhaustMap(({injectionId}) =>
            this.injectionService.validateTemplate(injectionId)
        ),
        map(NoAction)
    ));

    public readonly downloadResult = createEffect(() => this.actions$.pipe(
        ofType(InjectionActions.downloadResult),
        exhaustMap(({injectionId}) =>
            this.injectionService.downloadResult(injectionId)
        ),
        map(NoAction)
    ));

    public readonly editResultName = createEffect(() => this.actions$.pipe(
        ofType(InjectionActions.editResultName),
        exhaustMap(({injectionId, name}) =>
            this.injectionService.editResultName(injectionId, name)
        ),
        map(NoAction)
    ));

    public readonly changeOutputFormat = createEffect(() => this.actions$.pipe(
        ofType(InjectionActions.changeOutputFormat),
        exhaustMap(({injectionId, format}) =>
            this.injectionService.changeOutputFormat(injectionId, format)
        ),
        map(NoAction)
    ));

    public readonly copy = createEffect(() => this.actions$.pipe(
        ofType(InjectionActions.copy),
        exhaustMap(({injectionId}) =>
            this.injectionService.copy(injectionId)
        ),
        map(NoAction)
    ));

    public readonly remove = createEffect(() => this.actions$.pipe(
        ofType(InjectionActions.remove),
        exhaustMap(({injectionId}) =>
            this.injectionService.remove(injectionId)
        ),
        map(NoAction)
    ));

    constructor(
        private readonly actions$: Actions,
        private readonly injectionService: InjectionService
    ) {
    }

    private mapToProgress() {
        return pipe(
            filter((event: HttpEvent<unknown>) => event.type === HttpEventType.UploadProgress),
            map(event => {
                const asProgressEvent = event as HttpProgressEvent;

                return asProgressEvent.total
                    ? asProgressEvent.loaded / asProgressEvent.total
                    : -1;
            })
        );
    }
}

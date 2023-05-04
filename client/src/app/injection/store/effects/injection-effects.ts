import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {InjectionActions, InjectionQueueActions} from "../actions/injection-actions";
import {exhaustMap, filter, map, mergeMap, pipe} from "rxjs";
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
        map(NoAction)
    ));

    public readonly loadQueue = createEffect(() => this.actions$.pipe(
        ofType(InjectionQueueActions.loadQueue),
        exhaustMap(() =>
            this.injectionService.loadQueue(1)
        ),
        map(NoAction)
    ));

    public readonly createInjections = createEffect(() => this.actions$.pipe(
        ofType(InjectionQueueActions.createInjections),
        exhaustMap(({count}) =>
            this.injectionService.createInjections(1, count)
        ),
        map(NoAction)
    ));

    public readonly clearAll = createEffect(() => this.actions$.pipe(
        ofType(InjectionQueueActions.clear),
        exhaustMap(() =>
            this.injectionService.clearQueue(1)
        ),
        map(NoAction)
    ));

    public readonly uploadData = createEffect(() => this.actions$.pipe(
        ofType(InjectionActions.uploadDataSource),
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

    public readonly uploadTemplate = createEffect(() => this.actions$.pipe(
        ofType(InjectionActions.uploadTemplateSource),
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

    public readonly inject = createEffect(() => this.actions$.pipe(
        ofType(InjectionActions.inject),
        exhaustMap(({injectionId}) =>
            this.injectionService.inject(injectionId)
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

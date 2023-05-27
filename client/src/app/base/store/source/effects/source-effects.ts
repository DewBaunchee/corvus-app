import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {exhaustMap, map} from "rxjs";
import {NoAction} from "../../../../store/actions/app-actions";
import {SourceActions} from "../actions/source-actions";
import {SourceService} from "../../../service/source/source.service";

@Injectable()
export class SourceEffects {

    public readonly downloadSource = createEffect(() => this.actions$.pipe(
        ofType(SourceActions.download),
        exhaustMap(({id}) =>
            this.sourceService.downloadSource(id)
        ),
        map(NoAction)
    ));

    public readonly validateTemplate = createEffect(() => this.actions$.pipe(
        ofType(SourceActions.validateTemplate),
        exhaustMap(({sourceId}) =>
            this.sourceService.validateTemplate(sourceId)
        ),
        map(NoAction)
    ));

    constructor(
        private readonly actions$: Actions,
        private readonly sourceService: SourceService
    ) {
    }
}

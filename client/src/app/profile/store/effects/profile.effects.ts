import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {exhaustMap, map, mergeMap} from "rxjs";
import {ProfileActions} from "../actions/profile.actions";
import {ProfileService} from "../../service/profile/profile.service";

@Injectable()
export class ProfileEffects {

    public readonly loadProfile = createEffect(() => this.actions$.pipe(
        ofType(ProfileActions.loadProfile),
        mergeMap(() => [ProfileActions.loadCurrentSubscription({})]),
    ));

    public readonly loadCurrentSubscription = createEffect(() => this.actions$.pipe(
        ofType(ProfileActions.loadCurrentSubscription),
        exhaustMap(() =>
            this.profileService.loadCurrentSubscription()
        ),
        map(subscription => ProfileActions.updateCurrentSubscription({subscription}))
    ));

    constructor(
        private readonly actions$: Actions,
        private readonly profileService: ProfileService
    ) {
    }
}

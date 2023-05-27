import {AppState} from "../../../store/state/app-state";
import {createSelector} from "@ngrx/store";

export const selectProfileState = (state: AppState) => state.profile;
export const selectCurrentSubscription = createSelector(
    selectProfileState,
    state => state.currentSubscription,
);

import {AppState} from "../../../../store/state/app-state";
import {createSelector} from "@ngrx/store";

export const selectSecurityState = (state: AppState) => state.security;

export const selectAuthentication = createSelector(
    selectSecurityState,
    state => state.authentication,
);

export const selectIsGuest = createSelector(
    selectAuthentication,
    auth => auth?.guest
);

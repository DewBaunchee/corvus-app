import {AppState} from "../../../store/state/app-state";
import {createSelector} from "@ngrx/store";

export const selectInjection = (state: AppState) => state.injection;

export const selectInjectionQueue = createSelector(
    selectInjection,
    state => state.queue
);

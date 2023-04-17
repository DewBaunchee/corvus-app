import {initialInjectionState, InjectionState} from "../../injection/store/state/injection-state";

export interface AppState {
    injection: InjectionState;
}

export const initialState: () => AppState =
    () => ({
        injection: initialInjectionState()
    });

import {initialInjectionState, InjectionState} from "../../injection/store/state/injection-state";
import {initialSecurityState, SecurityState} from "../../base/store/security/state/security.state";
import {initialProfileState, ProfileState} from "../../profile/store/state/profile.state";

export interface AppState {
    security: SecurityState;
    profile: ProfileState;
    injection: InjectionState;
}

export const initialState: () => AppState =
    () => ({
        security: initialSecurityState(),
        profile: initialProfileState(),
        injection: initialInjectionState(),
    });

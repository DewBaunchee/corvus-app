import {createReducer, on} from "@ngrx/store";
import {initialSecurityState, SecurityState} from "../state/security.state";
import {SecurityActions} from "../actions/security.actions";

export const securityReducer = createReducer(
    initialSecurityState(),
    on(SecurityActions.updateAuthentication, (state, {authentication}): SecurityState => ({
        ...state,
        authentication,
    }))
);

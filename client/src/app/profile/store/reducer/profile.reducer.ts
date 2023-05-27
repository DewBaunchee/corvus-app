import {createReducer, on} from "@ngrx/store";
import {initialProfileState, ProfileState} from "../state/profile.state";
import {ProfileActions} from "../actions/profile.actions";

export const profileReducer = createReducer(
    initialProfileState(),
    on(ProfileActions.updateCurrentSubscription, (state, {subscription}): ProfileState => ({
        ...state,
        currentSubscription: subscription
    })),
    on(ProfileActions.updateUsername, (state, {username}): ProfileState => ({
        ...state,
        username
    }))
);

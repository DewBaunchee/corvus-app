import {ActionCreator, createAction} from "@ngrx/store";
import {ActionGroup} from "@ngrx/store/src/action_group_creator_models";
import {TypedAction} from "@ngrx/store/src/models";

export type ActionMap = { [key: string]: ActionCreator }

const actions: ActionMap = {};

export const getAction:<T> (type: string) => ActionCreator<string, (props: T) => TypedAction<string>> = type => actions[type] as any;

export const registerAction = (actionCreator: ActionCreator) => actions[actionCreator.type] = actionCreator;

export const registerActions = (actionGroup: ActionGroup<string, any>) =>
    Object.values(actionGroup).forEach(registerAction);


export const NoAction = createAction("No Action");

registerAction(NoAction);

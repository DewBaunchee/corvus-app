import {ActionCreator} from "@ngrx/store";
import {TypedAction} from "@ngrx/store/src/models";

export type EmptyProps = { empty?: unknown };
export type EmptyActionCreator = ActionCreator<string, (props: EmptyProps) => TypedAction<string>>;
export type AppActionCreator<Props> = ActionCreator<string, (props: Props) => TypedAction<string>>;


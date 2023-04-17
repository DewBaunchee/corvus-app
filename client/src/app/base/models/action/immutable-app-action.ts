/*
import {AppActionCreator} from "../../util/ngrx";
import {NoAction} from "../../../store/actions/app-actions";

export type ActionDisplayType = "separator" | "label" | "icon" | "none";

export interface AppAction<Props = any> {
    readonly name: string;
    readonly faIcon: string;
    readonly displayed: boolean;
    readonly disabled: boolean;
    readonly displayType: ActionDisplayType;
    readonly actionType: string;
    readonly props: Props;
}

export const createBlankAction: () => AppAction = () => ({
    name: "", faIcon: "",
    displayed: true, disabled: false,
    displayType: "none",
    actionType: NoAction.type, props: {}
});

export const createIconAction: <Props>(name: string, faIcon: string, actionCreator: AppActionCreator<Props>, props: Props) => AppAction =
    <Props>(name: string, faIcon: string, actionCreator: AppActionCreator<Props>, props: Props): AppAction => ({
        name, faIcon,
        displayed: true, disabled: false,
        displayType: "icon",
        actionType: actionCreator.type, props
    });

export const createLabelAction: <Props>(name: string, actionCreator: AppActionCreator<Props>, props: Props) => AppAction =
    <Props>(name: string, actionCreator: AppActionCreator<Props>, props: Props): AppAction => ({
        name, faIcon: "",
        displayed: true, disabled: false,
        displayType: "label",
        actionType: actionCreator.type, props
    });

export const createActionSeparator: () => AppAction =
    (): AppAction => ({
        name: "", faIcon: "",
        displayed: true, disabled: false,
        displayType: "separator",
        actionType: NoAction.type, props: {}
    });
*/

import {AppAction} from "./app-action";
import {AppState} from "../../../store/state/app-state";
import {Store} from "@ngrx/store";
import {AppActionCreator} from "../../util/ngrx";

export class AppActions {

    constructor(private readonly _list: AppAction[] = []) {
    }

    public get list() {
        return this._list;
    }

    public dispatch<Props>(to: Store<AppState>, actionCreator: AppActionCreator<Props>, props?: Props) {
        this.list.find(action => action.type === actionCreator.type)?.dispatchTo(to, props);
    }
}

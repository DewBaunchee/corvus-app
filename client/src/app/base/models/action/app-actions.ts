import {AppAction} from "./app-action";

export class AppActions {

    constructor(private readonly _list: AppAction[] = []) {
    }

    public get list() {
        return this._list;
    }

    public activate(type: string) {
        this.list.find(action => action.type === type)?.activate();
    }
}

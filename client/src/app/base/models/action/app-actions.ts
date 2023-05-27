import {AppAction} from "./app-action";

export class AppActions {

    constructor(private readonly _list: AppAction[] = []) {
    }

    public get list() {
        return this._list;
    }

    public get(type: string) {
        return this.list.find(action => action.type === type);
    }

    public activate(type: string) {
        this.get(type)?.activate();
    }
}

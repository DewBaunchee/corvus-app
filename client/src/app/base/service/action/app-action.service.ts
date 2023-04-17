import {Injectable} from "@angular/core";
import {ObservableMap} from "../../models/observable/map";
import {AppAction} from "../../models/action/app-action";

@Injectable()
export class AppActionService {

    private readonly _registered = new ObservableMap<string, AppAction>();

    public register(...actions: AppAction[]) {
        //
    }

    public unregister(...actionOrIds: (AppAction | string)[]) {
        actionOrIds.forEach(actionOrId => {
            this._registered.delete(this.idOf(actionOrId));
        });
    }

    public isRegistered(actionOrId: AppAction | string) {
        this._registered.has(this.idOf(actionOrId));
    }

    public registeredActions() {
        return this._registered.values();
    }

    public getRegisteredActions() {
        return this._registered.getValues();
    }

    private idOf(actionOrId: AppAction | string) {
        // return actionOrId instanceof AppAction ? actionOrId.id : actionOrId;
        return"";
    }
}

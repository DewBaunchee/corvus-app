import {ActionView, AppAction} from "./app-action";

export class BlankAction extends AppAction {

    constructor() {
        super("blank.action", ActionView.none());
    }

    public override activate() {
        // Nothing
    }
}

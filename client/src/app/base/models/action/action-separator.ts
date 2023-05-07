import {ActionView, AppAction} from "./app-action";

export class ActionSeparator extends AppAction {

    constructor() {
        super("separator", ActionView.createSeparator());
    }

    public override activate() {
        // Nothing
    }
}

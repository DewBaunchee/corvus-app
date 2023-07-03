import {ActionView, AppAction} from "./app-action";

export class SimpleAction extends AppAction {

    constructor(
        type: string,
        view: ActionView,
        private readonly handler = (it: SimpleAction) => {
            // Nothing
        }
    ) {
        super(type, view);
    }

    public override activate() {
        this.handler(this);
    }
}

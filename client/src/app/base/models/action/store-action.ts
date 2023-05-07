import {ActionView, AppAction} from "./app-action";
import { Store} from "@ngrx/store";
import {AppState} from "../../../store/state/app-state";
import {AppActionCreator} from "../../util/ngrx";

export class StoreAction<Props = any> extends AppAction {

    constructor(
        displayOptions: ActionView,
        private readonly store: Store<AppState>,
        private readonly actionCreator: AppActionCreator<Props>,
        private readonly props?: Props
    ) {
        super(actionCreator.type, displayOptions);
    }

    public override activate() {
        this.dispatchTo(this.store);
    }

    private dispatchTo(store: Store, props?: Props) {
        let finalProps = props;
        if (!finalProps) finalProps = this.props;
        if (!finalProps) throw new Error(
            `Props for action "${this.type}" has not been set during its creation and need to be provided by arguments!`
        );

        store.dispatch(this.actionCreator(finalProps));
    }
}

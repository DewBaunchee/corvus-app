import {BehaviorSubject} from "rxjs";
import {Store} from "@ngrx/store";
import {AppActionCreator} from "../../util/ngrx";
import {OnDestroy} from "../observable/destroyable";
import {NoAction} from "../../../store/actions/app-actions";

export type ActionDisplayType = "separator" | "label" | "icon" | "none";

export class AppAction<Props = any> extends OnDestroy {

    private readonly _disabled = new BehaviorSubject(false);

    private readonly _displayed = new BehaviorSubject(true);

    private constructor(
        public readonly name: string,
        public readonly faIcon: string,
        public readonly displayType: ActionDisplayType,
        private readonly actionCreator: AppActionCreator<Props>,
        private readonly props?: Props
    ) {
        super();
        this.completeOnDestroy(() => [this._disabled, this._displayed]);
    }

    public get type() {
        return this.actionCreator.type;
    }

    public static createBlank() {
        return new AppAction("", "", "none", NoAction, {});
    }

    public static createIcon<TProps>(name: string, faIcon: string, actionCreator: AppActionCreator<TProps>, props?: TProps) {
        return new AppAction(name, faIcon, "icon", actionCreator, props);
    }

    public static createLabel<TProps>(name: string, actionCreator: AppActionCreator<TProps>, props?: TProps) {
        return new AppAction(name, "", "label", actionCreator, props);
    }

    public static createSeparator() {
        return new AppAction("", "", "separator", NoAction, {});
    }

    public dispatchTo(store: Store, props?: Props) {
        if (this.isDisabled()) return;

        let finalProps = props;
        if (!finalProps) finalProps = this.props;
        if (!finalProps) throw new Error(
            `Props for action "${this.type}" has not been set during its creation and need to be provided by arguments!`
        );

        store.dispatch(this.actionCreator(finalProps));
    }

    public setDisabled(value: boolean) {
        this._disabled.next(value);
    }

    public enable() {
        this.setDisabled(true);
    }

    public disable() {
        this.setDisabled(false);
    }

    public isDisabled() {
        return this._disabled.getValue();
    }

    public disabled() {
        return this._disabled.asObservable();
    }

    public setDisplayed(value: boolean) {
        this._displayed.next(value);
    }

    public show() {
        this.setDisplayed(true);
    }

    public hide() {
        this.setDisplayed(false);
    }

    public isDisplayed() {
        return this._displayed.getValue();
    }

    public displayed() {
        return this._displayed.asObservable();
    }
}

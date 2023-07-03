import {OnDestroy} from "../observable/destroyable";
import {BehaviorSubject} from "rxjs";

export type ActionDisplayType = "default" | "separator" | "none";
export type ActionLabelPosition = "before-icon" | "after-icon" | "only-title";

export class ActionView {
    public displayType: ActionDisplayType = "default";
    public label?: string;
    public labelPosition: ActionLabelPosition = "only-title";
    public faIcon?: string;
    public assetIcon?: string;
    public color?: string;
    public disabled = false;

    public static none() {
        return new ActionView().setDisplayType("none");
    }

    public static createFa(label: string, faIcon: string) {
        return new ActionView()
            .setLabel(label)
            .setFaIcon(faIcon);
    }

    public static createSeparator() {
        return new ActionView().setDisplayType("separator");
    }

    public also(action: (it: ActionView) => void) {
        action(this);
        return this;
    }

    public setDisplayType(displayType: ActionDisplayType) {
        return this.also(it => it.displayType = displayType);
    }

    public setLabel(label: string) {
        return this.also(it => it.label = label);
    }

    public setLabelPosition(labelPosition: ActionLabelPosition) {
        return this.also(it => it.labelPosition = labelPosition);
    }

    public setFaIcon(faIcon: string) {
        return this.also(it => it.faIcon = faIcon);
    }

    public setAssetIcon(assetIcon: string) {
        return this.also(it => it.assetIcon = assetIcon);
    }

    public setColor(color: string) {
        return this.also(it => it.color = color);
    }

    public setDisabled(disabled: boolean) {
        return this.also(it => it.disabled = disabled);
    }
}

export abstract class AppAction extends OnDestroy {

    private readonly _visible = new BehaviorSubject(true);
    private readonly _disabled = new BehaviorSubject(false);

    protected constructor(
        public readonly type: string,
        public readonly view: ActionView
    ) {
        super();
    }

    public setVisible(value: boolean) {
        this._visible.next(value);
        return this;
    }

    public show() {
        this.setVisible(true);
        return this;
    }

    public hide() {
        this.setVisible(false);
        return this;
    }

    public isVisible() {
        return this._visible.getValue();
    }

    public visible() {
        return this._visible.asObservable();
    }

    public setDisabled(value: boolean) {
        this._disabled.next(value);
        return this;
    }

    public enable() {
        this.setDisabled(false);
        return this;
    }

    public disable() {
        this.setDisabled(true);
        return this;
    }

    public isDisabled() {
        return this._disabled.getValue();
    }

    public disabled() {
        return this._disabled.asObservable();
    }

    public abstract activate(): void;
}

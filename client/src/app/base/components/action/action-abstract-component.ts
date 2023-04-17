import {Directive, Input} from "@angular/core";
import {AppAction} from "../../models/action/app-action";
import {Store} from "@ngrx/store";

@Directive()
export class ActionAbstractComponent {

    @Input()
    public action = AppAction.createBlank();

    constructor(public readonly store: Store) {
    }

    public doAction() {
        this.action.dispatchTo(this.store);
    }
}

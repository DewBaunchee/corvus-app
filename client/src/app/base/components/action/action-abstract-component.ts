import {Directive, Input} from "@angular/core";
import {AppAction} from "../../models/action/app-action";
import {Store} from "@ngrx/store";
import {BlankAction} from "../../models/action/blank-action";

@Directive()
export class ActionAbstractComponent {

    @Input()
    public action: AppAction = new BlankAction();

    constructor(public readonly store: Store) {
    }

    public doAction() {
        this.action.activate();
    }
}

import {Component, HostBinding, HostListener} from "@angular/core";
import {ActionAbstractComponent} from "../action-abstract-component";

@Component({
    selector: "app-action",
    templateUrl: "./app-action.component.html",
    styleUrls: ["./app-action.component.scss"]
})
export class AppActionComponent extends ActionAbstractComponent {

    @HostBinding("class.hidden")
    public isHidden() {
        return this.action.isVisible();
    }

    @HostListener("click")
    public override doAction() {
        super.doAction();
    }
}

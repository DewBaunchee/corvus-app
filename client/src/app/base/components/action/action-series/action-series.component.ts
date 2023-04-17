import {Component, Input} from "@angular/core";
import {AppAction} from "../../../models/action/app-action";

@Component({
    selector: "action-series",
    templateUrl: "./action-series.component.html",
    styleUrls: ["./action-series.component.scss"],
})
export class ActionSeriesComponent {

    @Input()
    public actions: AppAction[] = [];
}

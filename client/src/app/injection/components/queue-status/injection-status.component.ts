import {Component, Input} from "@angular/core";
import {InjectionStatus} from "../../models/injection/injection-status";

@Component({
    selector: "injection-status",
    templateUrl: "./injection-status.component.html",
    styleUrls: ["./injection-status.component.scss"]
})
export class InjectionStatusComponent {

    private readonly faStyles: {
        [key in InjectionStatus]: string;
    } = {
        [InjectionStatus.EMPTY]: "fa fa-question-circle",
        [InjectionStatus.READY]: "fa fa-arrow-circle-right",
        [InjectionStatus.DONE]: "fa fa-circle-check",
    };

    @Input()
    public set status(value: InjectionStatus) {
        this.faStyle = this.faStyles[value];
    }

    public faStyle = "";
}

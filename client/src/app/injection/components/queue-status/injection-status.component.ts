import {Component, HostBinding, Input} from "@angular/core";
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
        [InjectionStatus.EMPTY]: "assets/status/empty.svg#main",
        [InjectionStatus.READY]: "assets/status/ready.svg#main",
        [InjectionStatus.ERROR]: "assets/status/error.svg#main",
        [InjectionStatus.SUCCESS]: "assets/status/success.svg#main",
    };

    @Input()
    public set status(value: InjectionStatus) {
        this.asset = this.faStyles[value];
        this.title = value;
    }

    public asset = "";
    @HostBinding("title") public title = "";
}

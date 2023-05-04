import {Component, Input} from "@angular/core";

@Component({
    selector: "dropdown",
    templateUrl: "./dropdown.component.html",
    styleUrls: ["./dropdown.component.scss"]
})
export class DropdownComponent {

    @Input() public titleFaIcon = "";
    @Input() public titleText = "";

    public isOpen = false;

    public toggle() {
        this.isOpen = !this.isOpen;
    }

    public open() {
        this.isOpen = true;
    }

    public close() {
        this.isOpen = false;
    }
}

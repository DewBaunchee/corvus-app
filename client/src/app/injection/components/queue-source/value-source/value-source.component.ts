import {Component, ElementRef} from "@angular/core";
import {AbstractSourceComponent} from "../abstract-source-component.directive";
import {ValueSource} from "../../../../base/models/source/value-source";

@Component({
    selector: "value-source",
    templateUrl: "./value-source.component.html",
    styleUrls: ["./value-source.component.scss"],
    providers: [{provide: AbstractSourceComponent, useExisting: ValueSourceComponent}]
})
export class ValueSourceComponent extends AbstractSourceComponent<"VALUE", ValueSource> {

    public readonly sourceType = "VALUE" as const;

    constructor(public readonly elementRef: ElementRef) {
        super();
    }
}

import {Component, ElementRef} from "@angular/core";
import {AbstractSourceComponent} from "../abstract-source-component.directive";
import {Base64Source} from "../../../../base/models/source/base64-source";

@Component({
    selector: "base64-source",
    templateUrl: "./base64-source.component.html",
    styleUrls: ["./base64-source.component.scss"],
    providers: [{provide: AbstractSourceComponent, useExisting: Base64SourceComponent}]
})
export class Base64SourceComponent extends AbstractSourceComponent<"BASE64", Base64Source> {

    public readonly sourceType = "BASE64" as const;

    constructor(public readonly elementRef: ElementRef) {
        super();
    }
}

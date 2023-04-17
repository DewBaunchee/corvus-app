import {Component} from "@angular/core";
import {AbstractSourceComponent} from "../abstract-source-component.directive";
import {Source} from "../../../models/source/source";

@Component({
    selector: "typed-source",
    templateUrl: "./typed-source.component.html",
    styleUrls: ["./typed-source.component.scss"]
})
export class TypedSourceComponent extends AbstractSourceComponent<Source> {

}

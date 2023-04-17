import {Component} from "@angular/core";
import {AbstractSourceComponent} from "../abstract-source-component.directive";
import {FileSource} from "../../../models/source/file-source";

@Component({
    selector: "file-source",
    templateUrl: "./file-source.component.html",
    styleUrls: ["./file-source.component.scss"]
})
export class FileSourceComponent extends AbstractSourceComponent<FileSource> {

}

import {Component, ElementRef, EventEmitter, Input, Output} from "@angular/core";
import {AbstractSourceComponent} from "../abstract-source-component.directive";
import {FileSource} from "../../../../base/models/source/file-source";
import {FileDecorator} from "../../../../base/models/file/file-decorator";

@Component({
    selector: "file-source",
    templateUrl: "./file-source.component.html",
    styleUrls: ["./file-source.component.scss"],
    providers: [{provide: AbstractSourceComponent, useExisting: FileSourceComponent}]
})
export class FileSourceComponent extends AbstractSourceComponent<"FILE", FileSource> {

    public readonly sourceType = "FILE" as const;

    @Input() public title = "";
    @Input() public defaultName = "";
    @Input() public allowedExtensions = "";
    @Output() public uploadFile = new EventEmitter<FileDecorator>();
    @Output() public notEditableClick = new EventEmitter<void>();

    constructor(public readonly elementRef: ElementRef) {
        super();
    }

    public dropZoneClicked() {
        if (this.editable) return;
        this.notEditableClick.emit();
    }
}

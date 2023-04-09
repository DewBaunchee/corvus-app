import {Directive, EventEmitter, HostListener, Output} from "@angular/core";
import {FileDecorator} from "../../models/file/file-decorator";

@Directive({
    selector: "[fileUpload]"
})
export class FileUploadDirective {

    @Output()
    public readonly files = new EventEmitter<FileDecorator[]>();

    @HostListener("dragover", ["$event"])
    private dragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
    }

    @HostListener("dragleave", ["$event"])
    private dragLeave(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
    }

    @HostListener("drop", ["$event"])
    private drop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();

        const files = event.dataTransfer?.files;
        if (!files) return;

        const decorators: FileDecorator[] = [];
        for (let i = 0; i < files.length; i++) {
            decorators.push(new FileDecorator(files[i]));
        }

        this.files.emit(decorators);
    }
}

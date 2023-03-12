import {Directive, HostListener} from '@angular/core';

@Directive({
    selector: '[fileUpload]'
})
export class FileUploadDirective {

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
    }
}

import {Directive, ElementRef, EventEmitter, HostListener, Input, Output} from "@angular/core";
import {FileDecorator} from "../../models/file/file-decorator";
import {GlobalFileInputService} from "../../service/file-input/global-file-input.service";

@Directive({
    selector: "[fileUpload]"
})
export class FileUploadDirective {

    @Output()
    public readonly file = new EventEmitter<FileDecorator>();

    @Output()
    public readonly files = new EventEmitter<FileDecorator[]>();

    @Input()
    public allowedExtensions = "";

    @Input()
    public mode: "single" | "multiple" = "single";

    @Input()
    public browseOnClick = true;

    constructor(
        private readonly elementRef: ElementRef,
        private readonly globalInput: GlobalFileInputService
    ) {

    }

    @HostListener("click", ["$event"])
    private click(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        if (!this.browseOnClick) return;

        this.globalInput.trigger(
            (files?: FileList) => this.handleFileList(files),
            {
                multiple: this.isMultipleMode(),
                extensions: this.getAllowedExtensions()
            }
        );
    }

    @HostListener("dragover", ["$event"])
    private dragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.elementRef.nativeElement.classList.add("drag-over");
    }

    @HostListener("dragleave", ["$event"])
    private dragLeave(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.elementRef.nativeElement.classList.remove("drag-over");
    }

    @HostListener("drop", ["$event"])
    private drop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.elementRef.nativeElement.classList.remove("drag-over");

        this.handleFileList(event.dataTransfer?.files);
    }

    private handleFileList(files?: FileList) {
        if (!files) return;

        const allowedExtensions = this.getAllowedExtensions();

        const decorators: FileDecorator[] = [];
        for (let i = 0; i < files.length; i++) {
            const decorated = new FileDecorator(files[i]);

            if (allowedExtensions.length > 0 && !allowedExtensions.includes(decorated.extension))
                continue;

            decorators.push(decorated);
        }

        if (decorators.length === 0) return;

        if (this.isMultipleMode()) {
            this.files.emit(decorators);
        } else {
            this.file.emit(decorators[0]);
        }
    }

    private isMultipleMode() {
        return this.mode === "multiple";
    }

    private getAllowedExtensions() {
        return this.allowedExtensions
            .split(",")
            .map(value => value.trim());
    }
}

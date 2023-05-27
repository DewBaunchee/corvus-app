import {Directive, ElementRef, EventEmitter, HostListener, Output} from "@angular/core";

@Directive({
    selector: "[outsideClick]"
})
export class OutsideClickDirective {

    @Output() public outsideClick = new EventEmitter<void>();

    constructor(private readonly elementRef: ElementRef) {
    }

    @HostListener("document:click", ["$event"])
    public onClick(event: MouseEvent) {
        const isIn = event.composedPath().find(target =>
            target === this.elementRef.nativeElement
        );
        if (isIn) return;

        this.outsideClick.emit();
    }
}

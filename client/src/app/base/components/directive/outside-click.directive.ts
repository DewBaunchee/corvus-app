import {Directive, ElementRef, EventEmitter, HostListener, Output} from "@angular/core";

@Directive({
    selector: "[outsideClick]"
})
export class OutsideClickDirective {

    @Output() public outsideClick = new EventEmitter<void>();

    constructor(private readonly elementRef: ElementRef) {
    }

    @HostListener("document:click", ["$event.target"])
    public onClick(target: HTMLElement) {
        if (this.elementRef.nativeElement.contains(target)) return;

        this.outsideClick.emit();
    }
}
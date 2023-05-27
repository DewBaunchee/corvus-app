import {Directive, ElementRef, EventEmitter, Input, Output} from "@angular/core";
import {Source, SourceType} from "../../../base/models/source/source";

@Directive()
export abstract class AbstractSourceComponent<ST extends SourceType = SourceType, S extends Source = Source<ST>> {

    public abstract sourceType: ST;

    public abstract elementRef: ElementRef;

    @Input() public editable = true;

    @Input()
    public set source(value: Source) {
        this.castedSource = value as S;
    }

    public castedSource?: S = undefined;

    @Output() public readonly sourceChange = new EventEmitter<S>();
}

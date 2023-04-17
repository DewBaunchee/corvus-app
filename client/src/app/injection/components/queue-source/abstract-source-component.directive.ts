import {Directive, Input} from "@angular/core";
import {Source} from "../../models/source/source";

@Directive()
export abstract class AbstractSourceComponent<TSource extends Source> {

    @Input()
    public set source(value: Source) {
        this.castedSource = value as TSource;
    }

    public castedSource?: TSource = undefined;
}

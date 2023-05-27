import {Pipe, PipeTransform} from "@angular/core";

const ellipsis = "...";

@Pipe({
    name: "ellipsis"
})
export class EllipsisPipe implements PipeTransform {

    public transform(value: string, maxLength = 20): unknown {
        return value.length > maxLength - ellipsis.length
            ? value.substring(0, maxLength - ellipsis.length) + ellipsis
            : value;
    }
}

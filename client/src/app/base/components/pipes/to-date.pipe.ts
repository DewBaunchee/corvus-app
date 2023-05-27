import {Pipe, PipeTransform} from "@angular/core";
import {DateModel} from "../../models/date/date-model";

@Pipe({
    name: "toDate"
})
export class ToDatePipe implements PipeTransform {

    public transform(value: DateModel): Date {
        return new Date(...value);
    }
}

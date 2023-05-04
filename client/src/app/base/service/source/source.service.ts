import {Injectable} from "@angular/core";
import {SourceHttpService} from "./source-http.service";

@Injectable()
export class SourceService {

    constructor(private readonly http: SourceHttpService) {
    }

    public downloadSource(id: number) {
        return this.http.downloadSource(id);
    }

    public validateTemplate(sourceId: number) {
        return this.http.validateTemplate(sourceId);
    }
}

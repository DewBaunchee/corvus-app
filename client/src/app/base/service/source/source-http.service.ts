import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import environment from "../../../../../env/environment";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class SourceHttpService {

    private readonly root: string = `${environment.baseUrl}/api/source`;

    constructor(private readonly http: HttpClient) {
    }

    public downloadSource(id: number): Observable<void> {
        window.open(encodeURI(`${this.root}/download?id=${id}`));
        return of(undefined);
    }

    public validateTemplate(sourceId: number): Observable<void> {
        window.open(encodeURI(`${this.root}/validate/template?sourceId=${sourceId}`));
        return of(undefined);
    }
}

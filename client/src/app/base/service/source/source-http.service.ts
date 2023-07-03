import {Injectable} from "@angular/core";
import {map, Observable} from "rxjs";
import environment from "../../../../../env/environment";
import {HttpClient} from "@angular/common/http";
import {downloadBlob} from "../../util/browser";

@Injectable()
export class SourceHttpService {

    private readonly root: string = `${environment.baseUrl}/api/source`;

    constructor(private readonly http: HttpClient) {
    }

    public downloadSource(id: number): Observable<void> {
        return this.http.get(
            `${this.root}/download?id=${id}`,
            {responseType: "blob", observe: "response"}
        ).pipe(
            map(response => {
                downloadBlob(response);
            })
        );
    }
}

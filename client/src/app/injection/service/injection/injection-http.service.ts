import {Injectable} from "@angular/core";
import {HttpClient, HttpParams, HttpRequest} from "@angular/common/http";
import environment from "../../../../../env/environment";
import {InjectionId} from "../../models/injection/injection-model";
import {Observable, of} from "rxjs";

@Injectable()
export class InjectionHttpService {

    private readonly root: string = `${environment.baseUrl}/api/injection`;

    constructor(private readonly http: HttpClient) {
    }

    public createQueue() {
        return this.http.post(
            `${this.root}/queue/create`,
            {}
        );
    }

    public loadQueue(queueId: number) {
        return this.http.post(
            `${this.root}/queue/load`,
            {},
            {
                params: new HttpParams()
                    .set("queueId", queueId)
            }
        );
    }

    public createInjections(queueId: number, count: number) {
        return this.http.post(
            `${this.root}/create`,
            {},
            {
                params: new HttpParams()
                    .set("queueId", queueId)
                    .set("count", count)
            });
    }

    public clearQueue(queueId: number) {
        return this.http.post(
            `${this.root}/queue/clear`,
            {},
            {
                params: new HttpParams()
                    .set("queueId", queueId)
            }
        );
    }

    public uploadDataFile(injectionId: InjectionId, data: File) {
        return this.uploadFile(injectionId, data, `${this.root}/upload/data`);
    }

    public uploadTemplateFile(injectionId: InjectionId, data: File) {
        return this.uploadFile(injectionId, data, `${this.root}/upload/template`);
    }

    private uploadFile(injectionId: InjectionId, file: File, url: string) {
        const formData = new FormData();
        formData.set("file", file);

        const request = new HttpRequest(
            "POST", url, formData,
            {
                reportProgress: true,
                params: new HttpParams()
                    .set("injectionId", injectionId)
            }
        );

        return this.http.request(request);
    }

    public inject(injectionId: InjectionId) {
        return this.http.post(
            `${this.root}/inject`,
            {},
            {
                params: new HttpParams()
                    .set("injectionId", injectionId)
            }
        );
    }

    public downloadResult(injectionId: InjectionId): Observable<void> {
        window.open(encodeURI(`${this.root}/download/result?injectionId=${injectionId}`));
        return of(undefined);
    }

    public remove(injectionId: InjectionId) {
        return this.http.post(
            `${this.root}/remove`,
            {},
            {
                params: new HttpParams()
                    .set("injectionId", injectionId)
            }
        );
    }
}

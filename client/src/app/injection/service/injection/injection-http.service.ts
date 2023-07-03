import {Injectable} from "@angular/core";
import {HttpClient, HttpParams, HttpRequest} from "@angular/common/http";
import environment from "../../../../../env/environment";
import {InjectionId} from "../../models/injection/injection-model";
import {map, Observable} from "rxjs";
import {InjectionQueueHeader, InjectionQueueModel} from "../../models/injection/injection-queue-model";
import {Source} from "../../../base/models/source/source";
import {downloadBlob} from "../../../base/util/browser";
import {DocumentFormat} from "../../../base/models/document/document-format";

@Injectable()
export class InjectionHttpService {

    private readonly root: string = `${environment.baseUrl}/api/injection`;

    constructor(private readonly http: HttpClient) {
    }

    public createQueue() {
        return this.http.get<InjectionQueueModel>(
            `${this.root}/queue/create`,
            {}
        );
    }

    public removeQueue(queueId: number) {
        return this.http.post(
            `${this.root}/queue/remove`,
            {},
            {
                params: new HttpParams().set("queueId", queueId)
            }
        );
    }

    public loadHeaders() {
        return this.http.get<InjectionQueueHeader[]>(
            `${this.root}/queue/load/headers`
        );
    }

    public loadQueue(queueId: number) {
        return this.http.get<InjectionQueueModel>(
            `${this.root}/queue/load`,
            {
                params: new HttpParams()
                    .set("queueId", queueId)
            }
        );
    }

    public injectAll(queueId: number) {
        return this.http.post(
            `${this.root}/queue/inject/all`,
            {},
            {
                params: new HttpParams()
                    .set("queueId", queueId)
            });
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

    public createFromTemplate(queueId: number, file: File) {
        return this.uploadFile(
            file,
            `${this.root}/create/from/template`,
            new HttpParams()
                .set("queueId", queueId)
        );
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

    public changeQueueName(queueId: number, name: string) {
        return this.http.post(
            `${this.root}/queue/name/change`,
            {},
            {
                params: new HttpParams()
                    .set("queueId", queueId)
                    .set("name", name)
            }
        );
    }

    public uploadDataFile(injectionId: InjectionId, data: File) {
        return this.uploadFile(data, `${this.root}/upload/data/file`, this.injectionIdParams(injectionId));
    }

    public uploadTemplateFile(injectionId: InjectionId, data: File) {
        return this.uploadFile(data, `${this.root}/upload/template/file`, this.injectionIdParams(injectionId));
    }

    public uploadDataSource(injectionId: InjectionId, data: Source) {
        return this.http.post(
            `${this.root}/upload/data`,
            data,
            {
                params: this.injectionIdParams(injectionId)
            }
        );
    }

    public uploadTemplateSource(injectionId: InjectionId, data: Source) {
        return this.http.post(
            `${this.root}/upload/template`,
            data,
            {
                params: this.injectionIdParams(injectionId)
            }
        );
    }

    private uploadFile(file: File, url: string, params: HttpParams) {
        const formData = new FormData();
        formData.set("file", file);

        const request = new HttpRequest(
            "POST", url, formData,
            {
                reportProgress: true,
                params
            }
        );

        return this.http.request(request);
    }

    public inject(injectionId: InjectionId) {
        return this.http.post(
            `${this.root}/inject`,
            {},
            {
                params: this.injectionIdParams(injectionId)
            }
        );
    }

    public validateTemplate(injectionId: number): Observable<void> {
        return this.http.post(
            `${this.root}/validate/template`,
            {},
            {
                responseType: "blob",
                observe: "response",
                params: new HttpParams().set("injectionId", injectionId)
            }
        ).pipe(
            map(response => {
                downloadBlob(response);
            })
        );
    }

    public downloadResult(injectionId: InjectionId): Observable<void> {
        return this.http.get(
            `${this.root}/result/download`,
            {
                responseType: "blob",
                observe: "response",
                params: this.injectionIdParams(injectionId)
            }
        ).pipe(
            map(response => {
                downloadBlob(response);
            })
        );
    }

    public editResultName(injectionId: InjectionId, name: string) {
        return this.http.post(
            `${this.root}/result/name/edit`,
            {},
            {
                params: this.injectionIdParams(injectionId)
                    .set("name", name)
            }
        );
    }

    public changeOutputFormat(injectionId: InjectionId, format: DocumentFormat) {
        return this.http.post(
            `${this.root}/output/format/change`,
            {},
            {
                params: this.injectionIdParams(injectionId)
                    .set("format", format)
            }
        );
    }

    public copy(injectionId: InjectionId) {
        return this.http.post(
            `${this.root}/copy`,
            {},
            {
                params: this.injectionIdParams(injectionId)
            }
        );
    }

    public remove(injectionId: InjectionId) {
        return this.http.post(
            `${this.root}/remove`,
            {},
            {
                params: this.injectionIdParams(injectionId)
            }
        );
    }

    public moveInjection(queueId: number, fromOrderId: number, toOrderId: number) {
        return this.http.post(
            `${this.root}/move/injection`,
            {},
            {
                params: new HttpParams()
                    .set("queueId", queueId)
                    .set("fromOrderId", fromOrderId)
                    .set("toOrderId", toOrderId)
            }
        );
    }

    private injectionIdParams(id: InjectionId) {
        return new HttpParams().set("injectionId", id);
    }
}

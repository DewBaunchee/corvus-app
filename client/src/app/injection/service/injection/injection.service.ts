import {Injectable} from "@angular/core";
import {InjectionHttpService} from "./injection-http.service";
import {NotificationService} from "../../../base/service/notification/notification.service";
import {InjectionId} from "../../models/injection/injection-model";
import {Observable} from "rxjs";
import {InjectionQueueHeader} from "../../models/injection/injection-queue-model";
import {Source} from "../../../base/models/source/source";
import {DocumentFormat} from "../../../base/models/document/document-format";

@Injectable()
export class InjectionService {

    constructor(
        private readonly http: InjectionHttpService,
        private readonly notification: NotificationService
    ) {
    }

    public createQueue() {
        return this.http.createQueue();
    }

    public removeQueue(queueId: number) {
        return this.http.removeQueue(queueId);
    }

    public loadHeaders(): Observable<InjectionQueueHeader[]> {
        return this.http.loadHeaders();
    }

    public loadQueue(queueId: number) {
        return this.http.loadQueue(queueId);
    }

    public injectAll(queueId: number) {
        return this.http.injectAll(queueId);
    }

    public createInjections(queueId: number, count: number) {
        return this.http.createInjections(queueId, count);
    }

    public createFromTemplate(queueId: number, file: File) {
        return this.http.createFromTemplate(queueId, file);
    }

    public clearQueue(queueId: number) {
        return this.http.clearQueue(queueId);
    }

    public changeQueueName(queueId: number, name: string) {
        return this.http.changeQueueName(queueId, name);
    }

    public uploadDataFile(injectionId: InjectionId, data: File) {
        return this.http.uploadDataFile(injectionId, data);
    }

    public uploadTemplateFile(injectionId: InjectionId, data: File) {
        return this.http.uploadTemplateFile(injectionId, data);
    }

    public uploadDataSource(injectionId: InjectionId, data: Source) {
        return this.http.uploadDataSource(injectionId, data);
    }

    public uploadTemplateSource(injectionId: InjectionId, data: Source) {
        return this.http.uploadTemplateSource(injectionId, data);
    }

    public inject(injectionId: InjectionId) {
        return this.http.inject(injectionId);
    }

    public validateTemplate(injectionId: number) {
        return this.http.validateTemplate(injectionId);
    }

    public downloadResult(injectionId: InjectionId) {
        return this.http.downloadResult(injectionId);
    }

    public editResultName(injectionId: InjectionId, name: string) {
        return this.http.editResultName(injectionId, name);
    }

    public changeOutputFormat(injectionId: InjectionId, format: DocumentFormat) {
        return this.http.changeOutputFormat(injectionId, format);
    }

    public copy(injectionId: InjectionId) {
        return this.http.copy(injectionId);
    }

    public remove(injectionId: InjectionId) {
        return this.http.remove(injectionId);
    }

    public moveInjection(queueId: number, fromOrderId: number, toOrderId: number) {
        return this.http.moveInjection(queueId, fromOrderId, toOrderId);
    }
}

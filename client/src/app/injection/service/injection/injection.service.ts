import {Injectable} from "@angular/core";
import {InjectionHttpService} from "./injection-http.service";
import {NotificationService} from "../../../base/service/notification/notification.service";
import {InjectionId} from "../../models/injection/injection-model";

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

    public loadQueue(queueId: number) {
        return this.http.loadQueue(queueId);
    }

    public createInjections(queueId: number, count: number) {
        return this.http.createInjections(queueId, count);
    }

    public clearQueue(queueId: number) {
        return this.http.clearQueue(queueId);
    }

    public uploadDataFile(injectionId: InjectionId, data: File) {
        return this.http.uploadDataFile(injectionId, data);
    }

    public uploadTemplateFile(injectionId: InjectionId, data: File) {
        return this.http.uploadTemplateFile(injectionId, data);
    }

    public inject(injectionId: InjectionId) {
        return this.http.inject(injectionId);
    }

    public downloadResult(injectionId: InjectionId) {
        return this.http.downloadResult(injectionId);
    }
}

import {Injectable} from "@angular/core";
import {FileDecorator} from "../../models/file/file-decorator";
import {BehaviorSubject, Observable} from "rxjs";
import {ReportTemplate} from "../../models/template/report-template";
import {onChange, wait} from "../../util/rxjs";
import {GenerationHttpService} from "./generation-http.service";
import {NotificationService} from "../notification/notification.service";

const lsDataKey = "generation-data";

@Injectable({
    providedIn: "root"
})
export class GenerationPageService {

    private readonly _data = new BehaviorSubject<string>("");

    private readonly _templates = new BehaviorSubject<ReportTemplate[]>([]);

    constructor(
        private readonly http: GenerationHttpService,
        private readonly notification: NotificationService
    ) {
        this._data.next(localStorage.getItem(lsDataKey) || "");

        this._data.pipe(
            onChange(),
            wait(500),
        ).subscribe((data: string) => localStorage.setItem(lsDataKey, data));
    }

    public addTemplates(templates: FileDecorator[]) {
        this._templates.getValue().push(...templates);
        this._templates.next(this.getTemplates());
    }

    public getTemplates(): ReportTemplate[] {
        return this._templates.getValue();
    }

    public templates(): Observable<ReportTemplate[]> {
        return this._templates.asObservable();
    }

    public setData(data: string) {
        this._data.next(data);
    }

    public getData(): string {
        return this._data.getValue();
    }

    public data(): Observable<string> {
        return this._data.asObservable();
    }

    public generate() {
        try {
            const data = JSON.parse(this.getData());
            const template = this.getTemplates()[0];
            this.http.generateFrom(data, template);
        } catch (error: unknown) {
            this.notification.showError((error as Error).message);
        }
    }
}

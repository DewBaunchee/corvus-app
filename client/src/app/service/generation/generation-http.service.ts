import {Injectable} from "@angular/core";
import {ReportTemplate} from "../../models/template/report-template";
import {HttpClient} from "@angular/common/http";
import environment from "../../../../env/environment";
import {GenerationRequest} from "../../models/request/generation/generation-request";

@Injectable({
    providedIn: "root"
})
export class GenerationHttpService {

    private readonly root: string = `${environment.baseUrl}/generation`;

    constructor(private readonly http: HttpClient) {
    }

    public generateFrom(data: object, template: ReportTemplate) {
        return this.generate({data, template});
    }

    public generate(request: GenerationRequest) {
        return this.http.post(`${this.root}/generate`, request);
    }
}

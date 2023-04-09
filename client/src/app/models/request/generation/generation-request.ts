import {ReportTemplate} from "../../template/report-template";

export interface GenerationRequest {
    data: object;
    template: ReportTemplate;
}

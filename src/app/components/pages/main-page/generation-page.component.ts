import {ChangeDetectionStrategy, Component} from "@angular/core";
import {FileDecorator} from "../../../models/file/file-decorator";
import {GenerationPageService} from "./service/generation-page.service";

@Component({
    selector: "generation-page",
    templateUrl: "./generation-page.component.html",
    styleUrls: ["./generation-page.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenerationPageComponent {

    public set data(data: string) {
        this.service.setData(data);
    }

    public get data(): string {
        return this.service.getData();
    }

    constructor(public readonly service: GenerationPageService) {
    }

    public uploadTemplates(files: FileDecorator[]) {
        this.service.addTemplates(files);
    }
}

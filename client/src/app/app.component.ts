import {ChangeDetectorRef, Component, ElementRef, ViewChild} from "@angular/core";
import {WebSocketService} from "./base/service/websocket/web-socket.service";
import {GlobalFileInputService} from "./base/service/file-input/global-file-input.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
})
export class AppComponent {

    @ViewChild("fileInput")
    private fileInput?: ElementRef;

    constructor(
        public readonly ws: WebSocketService,
        private readonly cdr: ChangeDetectorRef,
        private readonly globalInput: GlobalFileInputService
    ) {
        this.globalInput.setInputProvider(() => this.fileInput?.nativeElement);

        // Workaround because ws.connected() | async sometimes doesn't update the view
        setInterval(() => this.cdr.markForCheck(), 1000);
    }
}

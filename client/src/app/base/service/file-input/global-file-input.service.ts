import {Injectable} from "@angular/core";
import {NotificationService} from "../notification/notification.service";

export type FileInputOptions = {
    multiple?: boolean;
    extensions?: string[]
}

@Injectable()
export class GlobalFileInputService {

    private inputProvider: () => HTMLInputElement | undefined = () => undefined;

    private triggered = false;

    public setInputProvider(inputProvider: () => HTMLInputElement | undefined) {
        this.inputProvider = inputProvider;
    }

    constructor(private readonly notification: NotificationService) {
        window.onfocus = () => this.triggered = false;
    }

    public trigger(
        callback: (fileList?: FileList) => void,
        {multiple, extensions}: FileInputOptions = {
            multiple: true,
            extensions: []
        }) {
        const input = this.inputProvider();

        if (!input) {
            this.notification.showError("File input isn't provided.");
            return;
        }

        if (this.triggered) {
            throw new Error("File input already triggered");
        }

        if (multiple) {
            input.setAttribute("multiple", "multiple");
        } else {
            input.removeAttribute("multiple");
        }

        if (extensions && extensions.length > 0) {
            input.setAttribute(
                "accept",
                extensions
                    .map(ext => "." + ext)
                    .join(",")
            );
        } else {
            input.removeAttribute("accept");
        }

        input.onchange = () => {
            this.triggered = false;
            callback(input.files || undefined);
        };

        input.click();

        this.triggered = true;
    }
}

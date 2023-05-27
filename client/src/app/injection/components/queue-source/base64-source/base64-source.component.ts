import {ChangeDetectionStrategy, Component, ElementRef} from "@angular/core";
import {AbstractSourceComponent} from "../abstract-source-component.directive";
import {Base64Source, createBase64Source} from "../../../../base/models/source/base64-source";
import {MatDialog} from "@angular/material/dialog";
import {OpenTextDialogAction} from "../../../../base/models/action/open-text-dialog-action";
import {ActionView} from "../../../../base/models/action/app-action";
import {Constraints} from "../../../../base/models/constraints/constraints";

@Component({
    selector: "base64-source",
    templateUrl: "./base64-source.component.html",
    styleUrls: ["./base64-source.component.scss", "../source.component.scss"],
    providers: [{provide: AbstractSourceComponent, useExisting: Base64SourceComponent}],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Base64SourceComponent extends AbstractSourceComponent<"BASE64", Base64Source> {

    public readonly sourceType = "BASE64" as const;

    constructor(
        public readonly elementRef: ElementRef,
        public readonly dialog: MatDialog,
    ) {
        super();
    }

    public openDialog() {
        new OpenTextDialogAction(
            ActionView.none(),
            this.dialog,
            {
                data: {
                    maxLength: Constraints.Source.Base64.MAX_LENGTH,
                    readonly: !this.editable,
                    initial: this.castedSource?.value,
                    textArea: true,
                    placeholder: "Your value...",
                    onHide: this.emitSourceChange.bind(this)
                }
            }
        ).activate();
    }

    private emitSourceChange(textValue: string) {
        if (this.castedSource) {
            this.sourceChange.emit({
                ...this.castedSource,
                value: textValue,
            });
        } else {
            this.sourceChange.emit(createBase64Source(textValue));
        }
    }
}

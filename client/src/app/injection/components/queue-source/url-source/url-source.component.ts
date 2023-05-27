import {ChangeDetectionStrategy, Component, ElementRef} from "@angular/core";
import {AbstractSourceComponent} from "../abstract-source-component.directive";
import {createUrlSource, UrlSource} from "../../../../base/models/source/url-source";
import {ActionView} from "../../../../base/models/action/app-action";
import {OpenTextDialogAction} from "../../../../base/models/action/open-text-dialog-action";
import {MatDialog} from "@angular/material/dialog";
import {Constraints} from "../../../../base/models/constraints/constraints";

@Component({
    selector: "url-source",
    templateUrl: "./url-source.component.html",
    styleUrls: ["./url-source.component.scss", "../source.component.scss"],
    providers: [{provide: AbstractSourceComponent, useExisting: UrlSourceComponent}],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UrlSourceComponent extends AbstractSourceComponent<"URL", UrlSource> {

    public readonly sourceType = "URL" as const;

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
                    maxLength: Constraints.Source.Url.MAX_LENGTH,
                    readonly: !this.editable,
                    initial: this.castedSource?.url,
                    placeholder: "Your link...",
                    onHide: this.emitSourceChange.bind(this)
                }
            }
        ).activate();
    }

    private emitSourceChange(textValue: string) {
        if (this.castedSource) {
            this.sourceChange.emit({
                ...this.castedSource,
                url: textValue,
            });
        } else {
            this.sourceChange.emit(createUrlSource(textValue));
        }
    }
}

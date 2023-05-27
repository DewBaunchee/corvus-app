import {ChangeDetectionStrategy, Component, ElementRef} from "@angular/core";
import {AbstractSourceComponent} from "../abstract-source-component.directive";
import {createValueSource, ValueSource} from "../../../../base/models/source/value-source";
import {MatDialog} from "@angular/material/dialog";
import {OpenTextDialogAction} from "../../../../base/models/action/open-text-dialog-action";
import {ActionView} from "../../../../base/models/action/app-action";
import {Constraints} from "../../../../base/models/constraints/constraints";

@Component({
    selector: "value-source",
    templateUrl: "./value-source.component.html",
    styleUrls: ["./value-source.component.scss", "../source.component.scss"],
    providers: [{provide: AbstractSourceComponent, useExisting: ValueSourceComponent}],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValueSourceComponent extends AbstractSourceComponent<"VALUE", ValueSource> {

    public readonly sourceType = "VALUE" as const;

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
                    maxLength: Constraints.Source.Value.MAX_LENGTH,
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
            this.sourceChange.emit(createValueSource(textValue));
        }
    }
}

import {Component, Inject, OnDestroy} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, ValidatorFn} from "@angular/forms";
import {ValidationService} from "../../../../base/service/validation/validation.service";
import {NotificationService} from "../../../../base/service/notification/notification.service";

export interface EditTextDialogConfig {
    title?: string;
    placeholder?: string;
    maxLength?: number;
    readonly?: boolean;
    initial?: string;
    validator?: ValidatorFn;
    textArea?: boolean;
    onHide: (value: string) => void;
}

@Component({
    selector: "edit-text-dialog",
    templateUrl: "./edit-text-dialog.component.html",
    styleUrls: ["./edit-text-dialog.component.scss"]
})
export class EditTextDialogComponent implements OnDestroy {

    public readonly form = new FormGroup({
        text: new FormControl(this.config.initial || "", this.config.validator)
    }, {updateOn: "change"});

    constructor(
        public readonly dialogRef: MatDialogRef<EditTextDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public readonly config: EditTextDialogConfig,
        private readonly validationService: ValidationService,
        private readonly notification: NotificationService
    ) {
    }

    public ngOnDestroy() {
        this.config.onHide(this.form.controls.text.value || "");
    }

    public hide() {
        this.dialogRef.close();
    }

    public getErrors(controlName: string) {
        const control = this.getControl(controlName);
        if (control.untouched) return [];
        return this.validationService.getValidationMessages(control.errors);
    }

    private getControl(name: string) {
        const formControl = this.form.get(name);
        if (!formControl)
            throw this.notification.showDevError(`Cannot find control with name ${name}`);
        return formControl;
    }
}

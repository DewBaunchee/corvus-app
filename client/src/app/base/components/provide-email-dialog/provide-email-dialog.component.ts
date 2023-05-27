import {Component} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NotificationService} from "../../service/notification/notification.service";
import {ValidationService} from "../../service/validation/validation.service";
import {ProfileService} from "../../../profile/service/profile/profile.service";
import {MatDialogRef} from "@angular/material/dialog";
import {AppState} from "../../../store/state/app-state";
import {Store} from "@ngrx/store";
import {ProfileActions} from "../../../profile/store/actions/profile.actions";

@Component({
    selector: "app-provide-email-dialog",
    templateUrl: "./provide-email-dialog.component.html",
    styleUrls: ["./provide-email-dialog.component.scss"]
})
export class ProvideEmailDialogComponent {

    public readonly form = new FormGroup({
        email: new FormControl("", Validators.required),
    });

    constructor(
        private readonly dialogRef: MatDialogRef<ProvideEmailDialogComponent>,
        private readonly profile: ProfileService,
        private readonly store: Store<AppState>,
        private readonly notification: NotificationService,
        private readonly validationService: ValidationService
    ) {
    }

    public getErrors(controlName: string) {
        const control = this.getControl(controlName);
        if (control.untouched) return [];
        return this.validationService.getValidationMessages(control.errors);
    }

    public proceed() {
        if (this.form.errors) return;

        this.form.markAllAsTouched();

        const {email,} = this.form.value;
        if (!email) return;

        this.profile.provideEmail(email).subscribe(result => {
            if (result.success) {
                this.store.dispatch(ProfileActions.loadProfile({}));
                this.dialogRef.close();
                return;
            }

            Object.entries(result.errors).forEach(([key, values]) => {
                this.getControl(key).setErrors({"custom": values});
            });
        });
    }

    private getControl(name: string) {
        const formControl = this.form.get(name);
        if (!formControl)
            throw this.notification.showDevError(`Cannot find control with name ${name}`);
        return formControl;
    }
}

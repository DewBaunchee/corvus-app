import {Component} from "@angular/core";
import {MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {SecurityService} from "../../service/security/security.service";
import {HeaderService} from "../../service/header/header.service";
import {NotificationService} from "../../service/notification/notification.service";
import {ValidationService} from "../../service/validation/validation.service";

@Component({
    selector: "login-dialog",
    templateUrl: "./login-dialog.component.html",
    styleUrls: ["./login-dialog.component.scss"]
})
export class LoginDialogComponent {

    public readonly form = new FormGroup({
        username: new FormControl("", Validators.required),
        password: new FormControl("", Validators.required)
    });

    constructor(
        public readonly dialogRef: MatDialogRef<LoginDialogComponent>,
        public readonly security: SecurityService,
        public readonly headerService: HeaderService,
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

        const {username, password} = this.form.value;
        if (!username || !password) return;

        this.security.login(username, password).subscribe(token => {
            if ("errors" in token) {
                Object.entries(token.errors).forEach(([key, values]) => {
                    this.getControl(key).setErrors({"custom": values});
                });
            } else {
                this.dialogRef.close();
            }
        });
    }

    public toSignUp() {
        this.dialogRef.close();
        this.headerService.openRegisterDialog();
    }

    private getControl(name: string) {
        const formControl = this.form.get(name);
        if (!formControl)
            throw this.notification.showDevError(`Cannot find control with name ${name}`);
        return formControl;
    }
}

import {Component} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {SecurityService} from "../../service/security/security.service";
import {HeaderService} from "../../service/header/header.service";
import {NotificationService} from "../../service/notification/notification.service";
import {ValidationService} from "../../service/validation/validation.service";

@Component({
    selector: "register-dialog",
    templateUrl: "./register-dialog.component.html",
    styleUrls: ["./register-dialog.component.scss"]
})
export class RegisterDialogComponent {

    public readonly form = new FormGroup({
        username: new FormControl("", Validators.required),
        email: new FormControl(""),
        password: new FormControl("", Validators.required),
        confirmPassword: new FormControl("", Validators.required),
    });

    constructor(
        public readonly dialogRef: MatDialogRef<RegisterDialogComponent>,
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

        const {
            username,
            email,
            password,
            confirmPassword
        } = this.form.value;
        if (!username || !password || !confirmPassword) return;

        if (password !== confirmPassword) return;

        this.security.register(username, email, password).subscribe(result => {
            if (result.success) {
                this.toSignIn();
                return;
            }

            Object.entries(result.errors).forEach(([key, values]) => {
                this.getControl(key).setErrors({"custom": values});
            });
        });
    }

    public toSignIn() {
        this.dialogRef.close();
        this.headerService.openLoginDialog();
    }

    private getControl(name: string) {
        const formControl = this.form.get(name);
        if (!formControl)
            throw this.notification.showDevError(`Cannot find control with name ${name}`);
        return formControl;
    }
}

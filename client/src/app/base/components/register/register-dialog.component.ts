import {Component} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {SecurityService} from "../../service/security/security.service";
import {HeaderService} from "../../service/header/header.service";

@Component({
    selector: "register-dialog",
    templateUrl: "./register-dialog.component.html",
    styleUrls: ["./register-dialog.component.scss"]
})
export class RegisterDialogComponent {

    public readonly form = new FormGroup({
        username: new FormControl("", Validators.required),
        email: new FormControl("", Validators.required),
        password: new FormControl("", Validators.required),
        confirmPassword: new FormControl("", Validators.required),
    });

    constructor(
        public readonly dialogRef: MatDialogRef<RegisterDialogComponent>,
        public readonly security: SecurityService,
        public readonly headerService: HeaderService
    ) {
    }

    public getErrors(controlName: string) {
        return [];
    }

    public proceed() {
        //
    }

    public signIn() {
        this.dialogRef.close();
        this.headerService.openLoginDialog();
    }
}

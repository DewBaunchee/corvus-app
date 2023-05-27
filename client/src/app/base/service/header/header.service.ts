import {Injectable} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {LoginDialogComponent} from "../../components/login/login-dialog.component";
import {RegisterDialogComponent} from "../../components/register/register-dialog.component";
import {DEFAULT_DIALOG_WIDTH} from "../../../constants";
import {ProvideEmailDialogComponent} from "../../components/provide-email-dialog/provide-email-dialog.component";

@Injectable({
    providedIn: "root"
})
export class HeaderService {

    constructor(
        private readonly dialog: MatDialog
    ) {
    }

    public openLoginDialog() {
        this.dialog.open(
            LoginDialogComponent,
            {
                width: DEFAULT_DIALOG_WIDTH,
                autoFocus: "dialog"
            }
        );
    }

    public openRegisterDialog() {
        this.dialog.open(
            RegisterDialogComponent,
            {
                width: DEFAULT_DIALOG_WIDTH,
                autoFocus: "dialog"
            }
        );
    }

    public openProvideEmailDialog() {
        this.dialog.open(
            ProvideEmailDialogComponent,
            {
                width: DEFAULT_DIALOG_WIDTH,
                autoFocus: "dialog"
            }
        );
    }
}

import {ActionView, AppAction} from "./app-action";
import {ActionTypes} from "../../../constants";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {
    EditTextDialogComponent,
    EditTextDialogConfig
} from "../../../injection/components/dialogs/edit-text-dialog/edit-text-dialog.component";

export class OpenTextDialogAction extends AppAction {

    constructor(
        view: ActionView,
        private readonly dialog: MatDialog,
        private readonly config: MatDialogConfig<EditTextDialogConfig>
    ) {
        super(ActionTypes.OPEN_TEXT_DIALOG, view);
    }

    public override activate() {
        this.dialog.open(EditTextDialogComponent, this.config);
    }
}

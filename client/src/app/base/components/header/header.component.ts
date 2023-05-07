import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from "@angular/core";
import {AppActions} from "../../models/action/app-actions";
import {SimpleAction} from "../../models/action/simple-action";
import {ActionTypes} from "../../../constants";
import {ActionView} from "../../models/action/app-action";
import {HeaderService} from "../../service/header/header.service";
import {SecurityService} from "../../service/security/security.service";
import {DestroySubject} from "../../models/subjects/destroy-subject";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {

    public leftActions = new AppActions([]);
    public rightActions = new AppActions();

    private readonly destroySubject = DestroySubject.of(this);

    constructor(
        private readonly service: HeaderService,
        private readonly security: SecurityService,
        private readonly cdr: ChangeDetectorRef
    ) {
        security.isGuest()
            .pipe(this.destroySubject.takeUntil())
            .subscribe(isGuest => {
                if (isGuest) {
                    this.rightActions = new AppActions([
                        new SimpleAction(
                            ActionTypes.SIGN_IN,
                            ActionView.createFa("Sign In", "fa fa-sign-in"),
                            () => this.openLoginDialog(),
                        )
                    ]);
                } else {
                    this.rightActions = new AppActions([
                        new SimpleAction(
                            ActionTypes.SIGN_OUT,
                            ActionView.createFa("Sign Out", "fa fa-sign-out"),
                            () => this.openLoginDialog(),
                        )
                    ]);
                }
                this.cdr.markForCheck();
            });
    }

    public openLoginDialog() {
        this.service.openLoginDialog();
    }
}

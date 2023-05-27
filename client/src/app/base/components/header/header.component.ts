import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from "@angular/core";
import {AppActions} from "../../models/action/app-actions";
import {SimpleAction} from "../../models/action/simple-action";
import {ActionTypes} from "../../../constants";
import {ActionView} from "../../models/action/app-action";
import {HeaderService} from "../../service/header/header.service";
import {DestroySubject} from "../../models/subjects/destroy-subject";
import {AppState} from "../../../store/state/app-state";
import {Store} from "@ngrx/store";
import {selectAuthentication} from "../../store/security/selectors/security.selectors";
import {SecurityService} from "../../service/security/security.service";

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
        private readonly store: Store<AppState>,
        private readonly cdr: ChangeDetectorRef
    ) {
        store.select(selectAuthentication)
            .pipe(this.destroySubject.takeUntil())
            .subscribe(auth => {
                if (!auth || auth.guest) {
                    this.rightActions = new AppActions([
                        new SimpleAction(
                            ActionTypes.SIGN_IN,
                            ActionView.createFa("Sign In", "fa fa-sign-in"),
                            () => this.openLoginDialog(),
                        )
                    ]);
                } else {
                    this.rightActions = new AppActions([
                        ...(
                            auth.hasEmail
                                ? []
                                : [
                                    new SimpleAction(
                                        ActionTypes.PROVIDE_EMAIL,
                                        ActionView.createFa("Provide E-Mail", "fa fa-angle-double-up"),
                                        () => this.service.openProvideEmailDialog(),
                                    )
                                ]
                        ),
                        new SimpleAction(
                            ActionTypes.SIGN_OUT,
                            ActionView.createFa("Sign Out", "fa fa-sign-out"),
                            () => this.security.logout().subscribe(),
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

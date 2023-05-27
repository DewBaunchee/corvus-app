import {ChangeDetectorRef, Component} from "@angular/core";
import {AppState} from "../../../store/state/app-state";
import {Store} from "@ngrx/store";
import {Subscription} from "../../../profile/models/subscription";
import {DestroySubject} from "../../../base/models/subjects/destroy-subject";
import {selectProfileState} from "../../../profile/store/selectors/profile.selectors";

@Component({
    selector: "info-panel",
    templateUrl: "./info-panel.component.html",
    styleUrls: ["./info-panel.component.scss"]
})
export class InfoPanelComponent {

    public username?: string;

    public subscription?: Subscription;

    private readonly destroy = DestroySubject.of(this);

    constructor(private readonly store: Store<AppState>, private readonly cdr: ChangeDetectorRef) {
        this.store.select(selectProfileState)
            .pipe(this.destroy.takeUntil())
            .subscribe(state => {
                this.username = state.username;
                this.subscription = state.currentSubscription;
                this.cdr.markForCheck();
            });
    }
}

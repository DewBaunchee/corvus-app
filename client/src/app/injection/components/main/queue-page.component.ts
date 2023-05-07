import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {ActionView, AppAction} from "../../../base/models/action/app-action";
import {InjectionActions, InjectionQueueActions} from "../../store/actions/injection-actions";
import {InjectionQueue} from "../../models/injection/injection-queue-model";
import {DestroySubject} from "../../../base/models/subjects/destroy-subject";
import {selectInjectionQueue} from "../../store/selectors/injection-selectors";
import {AppState} from "../../../store/state/app-state";
import {Store} from "@ngrx/store";
import {InjectionStatus} from "../../models/injection/injection-status";
import {Injection} from "../../models/injection/injection-model";
import {AppActions} from "../../../base/models/action/app-actions";
import {WARNING_COLOR} from "../../../base/util/theme";
import {SourceActions} from "../../../base/store/actions/source-actions";
import {ActionSeparator} from "../../../base/models/action/action-separator";
import {StoreAction} from "../../../base/models/action/store-action";

@Component({
    selector: "queue-page",
    templateUrl: "./queue-page.component.html",
    styleUrls: ["./queue-page.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class QueuePageComponent implements OnInit {

    public readonly queueActions = new AppActions([
        new StoreAction(
            ActionView.createFa("Inject All", "fa fa-play"),
            this.store,
            InjectionQueueActions.injectAll,
            {}
        ),
        new ActionSeparator(),
        new StoreAction(
            ActionView.createFa("Create Injection", "fa fa-plus"),
            this.store,
            InjectionQueueActions.createInjections,
            {count: 1}
        ),
        new StoreAction(
            ActionView.createFa("Clear Queue", "fa fa-solid fa-trash"),
            this.store,
            InjectionQueueActions.clear,
            {}
        ),
    ]);

    public queue: InjectionQueue = new InjectionQueue();

    private readonly destroy = DestroySubject.of(this);

    constructor(
        private readonly store: Store<AppState>,
        private readonly cdr: ChangeDetectorRef
    ) {
    }

    public ngOnInit() {

        this.store.dispatch(InjectionQueueActions.loadQueue({}));

        this.store.select(selectInjectionQueue)
            .pipe(this.destroy.takeUntil())
            .subscribe(queue => {
                this.queue = InjectionQueue.fromModel(
                    queue, this.queueActions,
                    injection => {
                        const actions: AppAction[] = [];

                        if (injection.templateSource?.id > 0) {
                            actions.push(
                                new StoreAction(
                                    ActionView.createFa("Validate Template", "fa fa-search"),
                                    this.store,
                                    SourceActions.validateTemplate,
                                    {sourceId: injection.templateSource.id}
                                )
                            );
                        }

                        if (injection.status === InjectionStatus.SUCCESS) {
                            actions.push(
                                new StoreAction(
                                    ActionView.createFa("Download Result", "fa fa-download"),
                                    this.store,
                                    InjectionActions.downloadResult,
                                    {injectionId: injection.id}
                                )
                            );
                        } else if (injection.status === InjectionStatus.READY) {
                            actions.push(
                                new StoreAction(
                                    ActionView.createFa("Inject", "fa fa-play"),
                                    this.store,
                                    InjectionActions.inject,
                                    {injectionId: injection.id}
                                )
                            );
                        }

                        actions.push(
                            new StoreAction(
                                ActionView.createFa("Remove", "fa fa-solid fa-trash")
                                    .setColor(WARNING_COLOR),
                                this.store,
                                InjectionActions.remove,
                                {injectionId: injection.id}
                            )
                        );

                        return new Injection(injection, new AppActions(actions));
                    }
                );
                this.cdr.markForCheck();
            });
    }
}

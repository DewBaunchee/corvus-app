import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {ActionView, AppAction} from "../../../base/models/action/app-action";
import {InjectionActions, InjectionQueueActions} from "../../store/actions/injection-actions";
import {
    InjectionQueue,
    InjectionQueueModel,
    InjectionQueueOrHeader
} from "../../models/injection/injection-queue-model";
import {DestroySubject} from "../../../base/models/subjects/destroy-subject";
import {selectInjectionState} from "../../store/selectors/injection-selectors";
import {AppState} from "../../../store/state/app-state";
import {Store} from "@ngrx/store";
import {InjectionStatus} from "../../models/injection/injection-status";
import {Injection} from "../../models/injection/injection-model";
import {AppActions} from "../../../base/models/action/app-actions";
import {WARNING_COLOR} from "../../../base/util/theme";
import {ActionSeparator} from "../../../base/models/action/action-separator";
import {StoreAction} from "../../../base/models/action/store-action";
import {createTabsModel} from "../../../base/models/tabs/tabs-model";
import {InjectionState} from "../../store/state/injection-state";
import {OpenTextDialogAction} from "../../../base/models/action/open-text-dialog-action";
import {MatDialog} from "@angular/material/dialog";
import {combineLatest, of, switchMap} from "rxjs";
import {SubscriptionConstraintsService} from "../../../profile/service/subscription/subscription-constraints.service";
import {SimpleAction} from "../../../base/models/action/simple-action";

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
            () => ({queueId: this.queue.model.id})
        ),
        new ActionSeparator(),
        new StoreAction(
            ActionView.createFa("Create Injection", "fa fa-plus"),
            this.store,
            InjectionQueueActions.createInjections,
            () => ({queueId: this.queue.model.id, count: 1})
        ),
        new StoreAction(
            ActionView.createFa("Clear Queue", "fa fa-solid fa-trash"),
            this.store,
            InjectionQueueActions.clear,
            () => ({queueId: this.queue.model.id})
        ),
    ]);

    public tabs = createTabsModel();

    public queue: InjectionQueue = new InjectionQueue();

    private readonly destroy = DestroySubject.of(this);

    constructor(
        private readonly constraints: SubscriptionConstraintsService,
        private readonly store: Store<AppState>,
        private readonly dialog: MatDialog,
        private readonly cdr: ChangeDetectorRef,
    ) {
    }

    public ngOnInit() {

        this.store.dispatch(InjectionQueueActions.loadAllQueues({}));

        combineLatest([
            this.store.select(selectInjectionState),
            this.constraints.canCreateQueue()
        ]).pipe(
            switchMap(([injectionState, canCreateQueue]) =>
                combineLatest([
                        of(injectionState),
                        of(canCreateQueue),
                        this.constraints.canCreateInjection(injectionState.currentQueueId)
                    ]
                ),
            ),
            this.destroy.takeUntil(),
        ).subscribe(([injectionState, canCreateQueue, canCreateInjection]) => {
            this.cdr.markForCheck();

            this.updateTabs(injectionState, canCreateQueue);

            const queue = injectionState.queues[injectionState.currentQueueId];
            if (!queue) return;
            if (!("injections" in queue)) {
                this.store.dispatch(InjectionQueueActions.loadQueue({queueId: queue.id}));
                return;
            }
            this.updateQueue(queue, canCreateInjection);
        });
    }

    private updateTabs(injectionState: InjectionState, canCreate: boolean) {
        const queues = Object.values(injectionState.queues);
        this.tabs = {
            createAction: canCreate ? new StoreAction(
                ActionView
                    .createFa("Create", "fa fa-plus")
                    .setLabelPosition("before-icon"),
                this.store,
                InjectionQueueActions.createQueue,
                {}
            ) : undefined,
            activate: (queueId: number) => {
                if (injectionState.currentQueueId === queueId) return;
                this.store.dispatch(InjectionQueueActions.changeCurrentQueue({queueId}));
            },
            close: (queueId: number) => {
                this.store.dispatch(InjectionQueueActions.removeQueue({queueId}));
            },
            nameChanged: (queueId: number, name: string) => {
                this.store.dispatch(InjectionQueueActions.changeName({queueId, name}));
            },
            activeTab: injectionState.currentQueueId,
            tabs: queues.map((queueOrHeader: InjectionQueueOrHeader) => {
                return {
                    id: queueOrHeader.id,
                    name: queueOrHeader.name,
                    closeable: queues.length > 1
                };
            })
        };
    }

    private updateQueue(queue: InjectionQueueModel, canCreateInjection: boolean) {

        this.queueActions.get(InjectionQueueActions.createInjections.type)?.setDisabled(!canCreateInjection);
        this.queueActions.get(InjectionQueueActions.injectAll.type)?.setDisabled(queue.status !== InjectionStatus.READY);
        this.queueActions.get(InjectionQueueActions.clear.type)?.setDisabled(queue.injections.length === 0);

        this.queue = InjectionQueue.fromModel(
            queue, this.queueActions,
            injection => {
                const actions: AppAction[] = [];

                if (injection.templateSource?.id > 0) {
                    actions.push(
                        new StoreAction(
                            ActionView.createFa("Validate Template", "fa fa-search"),
                            this.store,
                            InjectionActions.validateTemplate,
                            {injectionId: injection.id}
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
                        new SimpleAction(
                            InjectionActions.inject.type,
                            ActionView.createFa("Inject", "fa fa-play"),
                            it => {
                                it.disable();
                                this.store.dispatch(InjectionActions.inject({injectionId: injection.id}));
                            }
                        )
                    );
                }

                if (injection.status !== InjectionStatus.SUCCESS) {
                    actions.push(
                        new OpenTextDialogAction(
                            ActionView.createFa("Edit result name", "fa fa-i-cursor"),
                            this.dialog,
                            {
                                data: {
                                    initial: injection.preferredResultName,
                                    placeholder: "Preferred result name",
                                    onHide: value =>
                                        this.store.dispatch(
                                            InjectionActions.editResultName({
                                                injectionId: injection.id,
                                                name: value
                                            })
                                        ),
                                }
                            }
                        )
                    );
                }

                if (canCreateInjection) {
                    actions.push(
                        new StoreAction(
                            ActionView.createFa("Copy", "fa fa-copy"),
                            this.store,
                            InjectionActions.copy,
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

                return new Injection(
                    injection,
                    new AppActions(actions),
                    injection.status !== InjectionStatus.SUCCESS
                );
            }
        );
    }
}

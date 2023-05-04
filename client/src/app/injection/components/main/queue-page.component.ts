import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {AppAction} from "../../../base/models/action/app-action";
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

@Component({
    selector: "queue-page",
    templateUrl: "./queue-page.component.html",
    styleUrls: ["./queue-page.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class QueuePageComponent implements OnInit {

    public readonly queueActions = new AppActions([
        AppAction.createFaIcon(
            "Inject All",
            "fa fa-play",
            InjectionQueueActions.injectAll,
            {}
        ),
        AppAction.createSeparator(),
        AppAction.createFaIcon(
            "Create Injection",
            "fa fa-plus",
            InjectionQueueActions.createInjections,
            {count: 1}
        ),
        AppAction.createFaIcon(
            "Clear Queue",
            "fa fa-solid fa-trash",
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
                                AppAction.createFaIcon(
                                    "Validate Template",
                                    "fa fa-search",
                                    SourceActions.validateTemplate,
                                    {sourceId: injection.templateSource.id}
                                )
                            );
                        }

                        if (injection.status === InjectionStatus.SUCCESS) {
                            actions.push(
                                AppAction.createFaIcon(
                                    "Download Result",
                                    "fa fa-download",
                                    InjectionActions.downloadResult,
                                    {injectionId: injection.id}
                                ),
                            );
                        } else if (injection.status === InjectionStatus.READY) {
                            actions.push(
                                AppAction.createFaIcon(
                                    "Inject",
                                    "fa fa-play",
                                    InjectionActions.inject,
                                    {injectionId: injection.id}
                                ),
                            );
                        }

                        actions.push(
                            AppAction.createFaIcon(
                                "Remove",
                                "fa fa-solid fa-trash",
                                InjectionActions.remove,
                                {injectionId: injection.id},
                                {color: WARNING_COLOR}
                            )
                        );

                        return new Injection(injection, new AppActions(actions));
                    }
                );
                this.cdr.markForCheck();
            });
    }
}

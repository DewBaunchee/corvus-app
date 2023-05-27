import {Injectable} from "@angular/core";
import {AppState} from "../../../store/state/app-state";
import {Store} from "@ngrx/store";
import {BehaviorSubject, combineLatest, map, Observable} from "rxjs";
import {selectCurrentSubscription} from "../../store/selectors/profile.selectors";
import {selectInjectionCount, selectQueueCount} from "../../../injection/store/selectors/injection-selectors";
import {SubscriptionKey} from "../../models/subscription";
import {FileDecorator} from "../../../base/models/file/file-decorator";

export interface SubscriptionConstraints {
    maxQueueCount?: number;
    maxInjectionCount?: number;
    maxFileSize?: number;
}

@Injectable()
export class SubscriptionConstraintsService {

    private readonly _currentSubscriptionConstraints =
        new BehaviorSubject<SubscriptionConstraints>({});

    constructor(private readonly store: Store<AppState>) {
        this.store.select(selectCurrentSubscription).subscribe(subscription => {
            if (!subscription) {
                this._currentSubscriptionConstraints.next({});
                return;
            }

            const constraints: SubscriptionConstraints = {};
            subscription.level.features.forEach(({key}) => {
                constraints.maxQueueCount ||= this.parseQueueCount(key);
                constraints.maxInjectionCount ||= this.parseInjectionCount(key);
                constraints.maxFileSize ||= this.parseFileSize(key);
            });
            this._currentSubscriptionConstraints.next(constraints);
        });
    }

    private parseQueueCount(key: string): number | undefined {
        return this.getNumberParameter(key, SubscriptionKey.MAX_QUEUE_COUNT);
    }

    private parseInjectionCount(key: string): number | undefined {
        return this.getNumberParameter(key, SubscriptionKey.MAX_INJECTION_COUNT);
    }

    private parseFileSize(key: string): number | undefined {
        return this.getNumberParameter(key, SubscriptionKey.MAX_FILE_SIZE);
    }

    private getNumberParameter(key: string, keyStart: string): number | undefined {
        const parameter = this.getParameter(key, keyStart);
        if (!parameter) return undefined;
        if (parameter === "infinite") return Infinity;
        return +parameter;
    }

    private getParameter(key: string, keyStart: string): string | undefined {
        const startIndex = this.getParameterStartIndex(key, keyStart);
        if (startIndex === undefined) return undefined;
        return key.substring(startIndex + 1);
    }

    private getParameterStartIndex(key: string, keyStart: string): number | undefined {
        if (!key.startsWith(keyStart)) return undefined;
        const dotIndex = key.lastIndexOf(".");
        if (dotIndex === -1) return undefined;
        return dotIndex;
    }

    public canCreateQueue(): Observable<boolean> {
        return combineLatest([
            this._currentSubscriptionConstraints,
            this.store.select(selectQueueCount)
        ]).pipe(
            map(([{maxQueueCount}, queueCount]) =>
                !!maxQueueCount && queueCount < maxQueueCount
            )
        );
    }

    public canCreateInjection(queueId: number): Observable<boolean> {
        return combineLatest([
            this._currentSubscriptionConstraints,
            this.store.select(selectInjectionCount(queueId))
        ]).pipe(
            map(([{maxInjectionCount}, injectionCount]) =>
                !!maxInjectionCount && injectionCount !== undefined && injectionCount < maxInjectionCount
            )
        );
    }

    public canLoad(decorated: FileDecorator) {
        const {maxFileSize} = this._currentSubscriptionConstraints.getValue();
        if (!maxFileSize) return false;
        return decorated.file.size > maxFileSize;
    }
}

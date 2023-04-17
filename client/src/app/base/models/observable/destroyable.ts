import {DestroySubject} from "../subjects/destroy-subject";
import {MonoTypeOperatorFunction, Subject, Subscription, takeUntil} from "rxjs";

export interface Destroyable {
    destroy: () => void;
}

export class OnDestroy implements Destroyable {

    private readonly _destroy = new DestroySubject();

    public destroy() {
        this._destroy.emit();
    }

    public onDestroy() {
        return this._destroy.asObservable();
    }

    public isDestroyed() {
        return this._destroy.closed;
    }

    public destroyOnDestroy(destroyables: () => Destroyable[]) {
        this.onDestroy().subscribe(() => {
            destroyables()?.forEach(destroyable => destroyable.destroy());
        });
    }

    public unsubscribeOnDestroy(subscriptions: () => Subscription[]) {
        this.onDestroy().subscribe(() => {
            subscriptions()?.forEach(subscription => subscription.unsubscribe());
        });
    }

    public completeOnDestroy(subjects: () => Subject<any>[]) {
        this.onDestroy().subscribe(() => {
            subjects()?.forEach(subject => subject.complete());
        });
    }

    public untilDestroy<T>(): MonoTypeOperatorFunction<T> {
        return takeUntil(this.onDestroy());
    }
}

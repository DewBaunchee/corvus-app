import {MonoTypeOperatorFunction, Subject, takeUntil} from "rxjs";

export class DestroySubject extends Subject<void> {

    public static of(component: any) {
        const subject: DestroySubject = new DestroySubject();
        const onDestroy: () => void = component.__proto__.ngOnDestroy;
        component.__proto__.ngOnDestroy = () => {
            onDestroy && onDestroy();
            subject.emit();
        };
        return subject;
    }

    public emit() {
        this.next();
    }

    public override next(value: void) {
        super.next(value);
        this.complete();
    }

    public takeUntil<T>(): MonoTypeOperatorFunction<T> {
        return takeUntil(this);
    }

    public completeOnEmit(subjects: () => Subject<any>[]) {
        this.subscribe(() => {
            subjects()?.forEach(subject => subject.complete());
        });
        return this;
    }
}

import {delay, filter, map, MonoTypeOperatorFunction, of, pairwise, pipe, startWith, switchMap} from "rxjs";
import {isBlank} from "./functions";

export const wait = <T>(ms: number): MonoTypeOperatorFunction<T> =>
    pipe(
        switchMap((value: T) =>
            of(value).pipe(delay(ms))
        )
    );

export const onChange = <T>(...filteredBy: ((value: T) => unknown)[]): MonoTypeOperatorFunction<T> => {
    let firstFire = true;
    return pipe(
        startWith(undefined) as MonoTypeOperatorFunction<T>,
        pairwise(),
        filter(([prev, curr]: [T, T]) => {
            if (firstFire) {
                firstFire = false;
                return true;
            }

            if (filteredBy.length === 0 || isBlank(prev) || isBlank(curr)) {
                return prev !== curr;
            }

            return filteredBy.some(f => f(prev) !== f(curr));
        }),
        map(([, curr]) => curr)
    );
};

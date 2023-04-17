import {map, Subject} from "rxjs";
import {CollectionChange} from "./change";
import {OnDestroy} from "./destroyable";
import {isPresent} from "../../util/functions";

export type MapChange<K, V> = CollectionChange<[K, V]>;

export class ObservableMap<K, V> extends OnDestroy {

    private readonly map = new Map<K, V>();

    private readonly change = new Subject<MapChange<K, V>>();

    constructor() {
        super();
        this.completeOnDestroy(() => [this.change]);
    }

    public set(key: K, value: V) {
        const replaced = this.map.get(key);
        this.map.set(key, value);
        this.change.next({
            added: [[key, value]],
            removed: isPresent(replaced) ? [[key, replaced as V]] : []
        });
    }

    public get(key: K) {
        return this.map.get(key);
    }

    public observe(key: K) {
        return this.mapChange(() => this.get(key));
    }

    public has(key: K) {
        return this.map.has(key);
    }

    public delete(key: K) {
        const deleted = this.get(key);
        this.map.delete(key);
        if (isPresent(deleted)) {
            this.change.next({
                added: [],
                removed: [[key, deleted as V]]
            });
        }
    }

    public getKeys() {
        return Array.from(this.map.keys());
    }

    public keys() {
        return this.mapChange(() => this.getKeys());
    }

    public getValues() {
        return Array.from(this.map.values());
    }

    public values() {
        return this.mapChange(() => this.getValues());
    }

    public getEntries() {
        return Array.from(this.map.entries());
    }

    public entries() {
        return this.mapChange(() => this.getEntries());
    }

    public forEach(iterator: (value: V, key: K, map: Map<K, V>) => void) {
        this.map.forEach(iterator);
    }

    public onChange() {
        return this.change.asObservable();
    }

    public onAdded() {
        return this.mapChange(change => change.added);
    }

    public onRemoved() {
        return this.mapChange(change => change.removed);
    }

    private mapChange<R>(mapper: (value: MapChange<K, V>, index: number) => R) {
        return this.change.pipe(map(mapper));
    }
}

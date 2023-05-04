import {Component, ElementRef} from "@angular/core";
import {AbstractSourceComponent} from "../abstract-source-component.directive";
import {UrlSource} from "../../../../base/models/source/url-source";
import {AppActions} from "../../../../base/models/action/app-actions";
import {AppAction} from "../../../../base/models/action/app-action";
import {NoAction} from "../../../../store/actions/app-actions";
import {BehaviorSubject} from "rxjs";
import {Source} from "../../../../base/models/source/source";

@Component({
    selector: "url-source",
    templateUrl: "./url-source.component.html",
    styleUrls: ["./url-source.component.scss"],
    providers: [{provide: AbstractSourceComponent, useExisting: UrlSourceComponent}]
})
export class UrlSourceComponent extends AbstractSourceComponent<"URL", UrlSource> {

    public readonly sourceType = "URL" as const;

    public readonly actions = new AppActions([
        AppAction.createFaIcon("Test link", "fa fa-link", NoAction)
    ]);

    override set source(value: Source) {
        super.source = value;
        this._link.next(this.castedSource?.url || "");
    }

    private readonly _link = new BehaviorSubject("");

    public set link(value: string) {
        this._link.next(value);
    }

    public get link(): string {
        return this._link.getValue();
    }

    constructor(public readonly elementRef: ElementRef) {
        super();
    }
}

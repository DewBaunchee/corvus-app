import {
    ChangeDetectionStrategy,
    Component,
    ContentChildren,
    ElementRef,
    Input,
    OnInit,
    QueryList,
    ViewChild
} from "@angular/core";
import {AbstractSourceComponent} from "../abstract-source-component.directive";
import {Source, SourceType} from "../../../../base/models/source/source";
import {DestroySubject} from "../../../../base/models/subjects/destroy-subject";
import {BehaviorSubject, combineLatest, map, of, startWith, switchMap} from "rxjs";

export interface SourceSelectOption {
    name: string;
    faIcon?: string;
    text: string;
    type: SourceType;
    component: AbstractSourceComponent;
}

@Component({
    selector: "source-selector",
    templateUrl: "./source-selector.component.html",
    styleUrls: ["./source-selector.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourceSelectorComponent implements OnInit {

    @Input()
    public set source(value: Source | undefined) {
        this.source$.next(value);
    }

    @Input()
    public set editable(value: boolean) {
        this.editable$.next(value);
    }

    @ViewChild("sourceContainer")
    public set sourceContainer(value: ElementRef) {
        this.sourceContainer$.next(value);
    }

    @ContentChildren(AbstractSourceComponent)
    public set sources(value: QueryList<AbstractSourceComponent>) {
        this.sources$.next(value);
    }

    public readonly source$ = new BehaviorSubject<Source | undefined>(undefined);
    public readonly editable$ = new BehaviorSubject<boolean>(true);
    public readonly sourceContainer$ = new BehaviorSubject<ElementRef | undefined>(undefined);
    public readonly sources$ = new BehaviorSubject<QueryList<AbstractSourceComponent> | undefined>(undefined);
    public readonly options = new BehaviorSubject<SourceSelectOption[]>([]);
    public readonly selectedOption = new BehaviorSubject<SourceSelectOption | undefined>(undefined);
    public readonly selectedComponent = new BehaviorSubject<AbstractSourceComponent | undefined>(undefined);

    constructor() {
        DestroySubject.of(this)
            .completeOnEmit(() => [
                this.sourceContainer$,
                this.sources$,
                this.options,
                this.selectedOption,
                this.selectedComponent,
            ]);
    }

    public ngOnInit() {
        combineLatest([this.changingSources(), this.source$]).subscribe(([sources, source]) => {
            const options: SourceSelectOption[] = [];

            sources?.forEach(sourceComponent => {
                const option = this.toOption(sourceComponent);
                if (option) options.push(option);
            });

            this.options.next(options);
        });

        combineLatest([this.options, this.source$]).subscribe(([options, source]) => {
            options.forEach(option => {
                if (source && option.type === source.type) {
                    option.component.source = source;
                    this.selectedOption.next(option);
                }
            });
        });

        combineLatest([this.options, this.editable$]).subscribe(([options, editable]) => {
            options.forEach(option => {
                option.component.editable = editable;
            });
        });

        this.options.subscribe(options => {
            if (this.selectedOption.getValue()) return;
            this.selectedOption.next(options[0]);
        });

        combineLatest([
            this.sources$,
            this.selectedOption
        ]).subscribe(([sources, selectedOption]) => {
            if (!sources) return;

            const sourceComponent =
                sources.find(source => source.sourceType === selectedOption?.type);
            this.selectedComponent.next(sourceComponent);
        });

        combineLatest([
            this.sourceContainer$,
            this.selectedComponent,
        ]).subscribe(([sourceContainer, component]) => {
            if (!sourceContainer) return;
            const element = sourceContainer.nativeElement as HTMLElement;
            element.replaceChildren();
            if (!component) return;
            element.appendChild(component.elementRef.nativeElement);
        });
    }

    public changingSources() {
        return this.sources$.pipe(
            switchMap(sources =>
                sources
                    ? sources.changes.pipe(startWith(undefined))
                    : of(undefined)
            ),
            map(() => this.sources$.getValue())
        );
    }

    private toOption(component: AbstractSourceComponent): SourceSelectOption | undefined {
        const sourceType = component.sourceType;

        if (sourceType === "FILE") return {
            name: "File source",
            faIcon: "fa fa-file",
            text: "",
            type: "FILE",
            component
        };
        if (sourceType === "URL") return {
            name: "URL source",
            faIcon: "fa fa-link",
            text: "",
            type: "URL",
            component
        };
        if (sourceType === "VALUE") return {
            name: "Value source",
            faIcon: "fa fa-i-cursor",
            text: "",
            type: "VALUE",
            component
        };
        if (sourceType === "BASE64") return {
            name: "Base64 source",
            text: "64",
            type: "BASE64",
            component
        };

        return undefined;
    }
}

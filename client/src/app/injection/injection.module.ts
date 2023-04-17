import {NgModule} from "@angular/core";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {QueuePageComponent} from "./components/main/queue-page.component";
import {BaseModule} from "../base/base.module";
import {InjectionHttpService} from "./service/injection/injection-http.service";
import {InjectionService} from "./service/injection/injection.service";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {InfoPanelComponent} from "./components/info-panel/info-panel.component";
import {QueueComponent} from "./components/queue/queue.component";
import {InjectionStatusComponent} from "./components/queue-status/injection-status.component";
import {StoreModule} from "@ngrx/store";
import {injectionReducer} from "./store/reducer/injection-reducer";
import {EffectsModule} from "@ngrx/effects";
import {InjectionEffects} from "./store/effects/injection-effects";
import { FileSourceComponent } from "./components/queue-source/file-source/file-source.component";
import { TypedSourceComponent } from "./components/queue-source/typed-source/typed-source.component";


@NgModule({
    declarations: [
        QueuePageComponent,
        InfoPanelComponent,
        QueueComponent,
        InjectionStatusComponent,
        FileSourceComponent,
        TypedSourceComponent,
    ],
    imports: [
        BaseModule,
        CommonModule,
        FormsModule,
        HttpClientModule,
        NgOptimizedImage,
        StoreModule.forFeature("injection", injectionReducer),
        EffectsModule.forFeature(InjectionEffects)
    ],
    exports: [
        QueuePageComponent
    ],
    providers: [
        InjectionHttpService,
        InjectionService
    ]
})
export class InjectionModule {
}

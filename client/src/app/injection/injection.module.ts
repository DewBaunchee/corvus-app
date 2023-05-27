import {NgModule} from "@angular/core";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {QueuePageComponent} from "./components/main/queue-page.component";
import {BaseModule} from "../base/base.module";
import {InjectionHttpService} from "./service/injection/injection-http.service";
import {InjectionService} from "./service/injection/injection.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {InfoPanelComponent} from "./components/info-panel/info-panel.component";
import {QueueComponent} from "./components/queue/queue.component";
import {InjectionStatusComponent} from "./components/queue-status/injection-status.component";
import {StoreModule} from "@ngrx/store";
import {injectionReducer} from "./store/reducer/injection-reducer";
import {EffectsModule} from "@ngrx/effects";
import {InjectionEffects} from "./store/effects/injection-effects";
import {FileSourceComponent} from "./components/queue-source/file-source/file-source.component";
import {SourceSelectorComponent} from "./components/queue-source/source-selector/source-selector.component";
import {UrlSourceComponent} from "./components/queue-source/url-source/url-source.component";
import {ValueSourceComponent} from "./components/queue-source/value-source/value-source.component";
import {Base64SourceComponent} from "./components/queue-source/base64-source/base64-source.component";
import {MatDialogModule} from "@angular/material/dialog";
import { EditTextDialogComponent } from './components/dialogs/edit-text-dialog/edit-text-dialog.component';


@NgModule({
    declarations: [
        QueuePageComponent,
        InfoPanelComponent,
        QueueComponent,
        InjectionStatusComponent,
        FileSourceComponent,
        SourceSelectorComponent,
        UrlSourceComponent,
        ValueSourceComponent,
        Base64SourceComponent,
        EditTextDialogComponent,
    ],
    imports: [
        BaseModule,
        CommonModule,
        FormsModule,
        HttpClientModule,
        NgOptimizedImage,
        StoreModule.forFeature("injection", injectionReducer),
        EffectsModule.forFeature(InjectionEffects),
        MatDialogModule,
        ReactiveFormsModule
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

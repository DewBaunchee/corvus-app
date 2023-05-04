import {FileUploadDirective} from "./components/directive/file-upload.directive";
import {NotificationService} from "./service/notification/notification.service";
import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {ActionIconComponent} from "./components/action/action-icon/action-icon.component";
import {ActionLabelComponent} from "./components/action/action-label/action-label.component";
import {AppActionService} from "./service/action/app-action.service";
import {AppActionComponent} from "./components/action/app-action/app-action.component";
import {NgOptimizedImage} from "@angular/common";
import {HeaderComponent} from "./components/header/header.component";
import {ActionSeriesComponent} from "./components/action/action-series/action-series.component";
import {ActionSeparatorComponent} from "./components/action/action-separator/action-separator.component";
import {WebSocketService} from "./service/websocket/web-socket.service";
import {RxStompService, rxStompServiceFactory} from "./service/websocket/rx-stomp.service";
import {GlobalFileInputService} from "./service/file-input/global-file-input.service";
import {DropdownComponent} from "./components/dropdown/dropdown.component";
import {OutsideClickDirective} from "./components/directive/outside-click.directive";
import {SourceService} from "./service/source/source.service";
import {EffectsModule} from "@ngrx/effects";
import {SourceEffects} from "./store/effects/source-effects";
import {SourceHttpService} from "./service/source/source-http.service";
import {HttpErrorInterceptor} from "./service/http-interceptor/http-error-interceptor";
import {HTTP_INTERCEPTORS} from "@angular/common/http";


@NgModule({
    declarations: [
        FileUploadDirective,
        ActionIconComponent,
        ActionLabelComponent,
        AppActionComponent,
        HeaderComponent,
        ActionSeriesComponent,
        ActionSeparatorComponent,
        DropdownComponent,
        OutsideClickDirective,
    ],
    imports: [
        BrowserModule,
        NgOptimizedImage,
        EffectsModule.forFeature(SourceEffects)
    ],
    exports: [
        FileUploadDirective,
        AppActionComponent,
        HeaderComponent,
        ActionSeriesComponent,
        DropdownComponent
    ],
    providers: [
        NotificationService,
        AppActionService,
        GlobalFileInputService,
        WebSocketService,
        SourceHttpService,
        SourceService,
        {
            provide: RxStompService,
            useValue: rxStompServiceFactory()
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpErrorInterceptor,
            multi: true,
        }
    ]
})
export class BaseModule {
}

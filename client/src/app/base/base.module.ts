import {FileUploadDirective} from "./components/directive/file-upload.directive";
import {NotificationService} from "./service/notification/notification.service";
import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {ActionDefaultComponent} from "./components/action/action-default/action-default.component";
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
import {SecurityHttpInterceptor} from "./service/http-interceptor/security-http-interceptor";
import {SecurityService} from "./service/security/security.service";
import {LoginDialogComponent} from "./components/login/login-dialog.component";
import {MatDialogModule} from "@angular/material/dialog";
import {ReactiveFormsModule} from "@angular/forms";
import {RegisterDialogComponent} from "./components/register/register-dialog.component";


@NgModule({
    declarations: [
        FileUploadDirective,
        ActionDefaultComponent,
        AppActionComponent,
        HeaderComponent,
        ActionSeriesComponent,
        ActionSeparatorComponent,
        DropdownComponent,
        OutsideClickDirective,
        LoginDialogComponent,
        RegisterDialogComponent,
    ],
    imports: [
        BrowserModule,
        NgOptimizedImage,
        EffectsModule.forFeature(SourceEffects),
        MatDialogModule,
        ReactiveFormsModule
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
        SecurityService,
        {
            provide: RxStompService,
            useValue: rxStompServiceFactory()
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: SecurityHttpInterceptor,
            multi: true,
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

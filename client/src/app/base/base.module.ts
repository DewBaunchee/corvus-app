import {FileUploadDirective} from "./components/directive/file-upload.directive";
import {NotificationService} from "./service/notification/notification.service";
import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {ActionIconComponent} from "./components/action/action-icon/action-icon.component";
import {ActionLabelComponent} from "./components/action/action-label/action-label.component";
import {AppActionService} from "./service/action/app-action.service";
import {AppActionComponent} from "./components/action/typed-action/app-action.component";
import {NgOptimizedImage} from "@angular/common";
import {HeaderComponent} from "./components/header/header.component";
import {ActionSeriesComponent} from "./components/action/action-series/action-series.component";
import {ActionSeparatorComponent} from "./components/action/action-separator/action-separator.component";
import {WebSocketService} from "./service/websocket/web-socket.service";
import {RxStompService, rxStompServiceFactory} from "./service/websocket/rx-stomp.service";
import {GlobalFileInputService} from "./service/file-input/global-file-input.service";


@NgModule({
    declarations: [
        FileUploadDirective,
        ActionIconComponent,
        ActionLabelComponent,
        AppActionComponent,
        HeaderComponent,
        ActionSeriesComponent,
        ActionSeparatorComponent,
    ],
    imports: [
        BrowserModule,
        NgOptimizedImage
    ],
    exports: [
        FileUploadDirective,
        AppActionComponent,
        HeaderComponent,
        ActionSeriesComponent
    ],
    providers: [
        NotificationService,
        AppActionService,
        GlobalFileInputService,
        WebSocketService,
        {
            provide: RxStompService,
            useValue: rxStompServiceFactory()
        }
    ]
})
export class BaseModule {
}

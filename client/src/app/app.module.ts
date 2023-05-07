import {NgModule} from "@angular/core";

import {AppComponent} from "./app.component";
import {BaseModule} from "./base/base.module";
import {InjectionModule} from "./injection/injection.module";
import {StoreModule} from "@ngrx/store";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {EffectsModule} from "@ngrx/effects";
import {AsyncPipe, NgIf} from "@angular/common";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BaseModule,
        InjectionModule,
        StoreModule.forRoot(),
        EffectsModule.forRoot(),
        StoreDevtoolsModule.instrument(),
        NgIf,
        AsyncPipe,
        BrowserAnimationsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {

}

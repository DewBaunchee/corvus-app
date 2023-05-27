import {NgModule} from "@angular/core";

import {AppComponent} from "./app.component";
import {BaseModule} from "./base/base.module";
import {InjectionModule} from "./injection/injection.module";
import {StoreModule} from "@ngrx/store";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {EffectsModule} from "@ngrx/effects";
import {AsyncPipe, NgIf} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {initialState} from "./store/state/app-state";
import {ProfileModule} from "./profile/profile.module";

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BaseModule,
        ProfileModule,
        InjectionModule,
        StoreModule.forRoot(undefined, {initialState: initialState()}),
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

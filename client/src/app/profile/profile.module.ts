import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {StoreModule} from "@ngrx/store";
import {profileReducer} from "./store/reducer/profile.reducer";
import {EffectsModule} from "@ngrx/effects";
import {ProfileEffects} from "./store/effects/profile.effects";
import {ProfileHttpService} from "./service/profile/profile.http.service";
import {ProfileService} from "./service/profile/profile.service";
import {SubscriptionConstraintsService} from "./service/subscription/subscription-constraints.service";


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        EffectsModule.forFeature(ProfileEffects),
        StoreModule.forFeature("profile", profileReducer),
    ],
    providers: [
        ProfileHttpService,
        ProfileService,
        SubscriptionConstraintsService,
    ]
})
export class ProfileModule {
}

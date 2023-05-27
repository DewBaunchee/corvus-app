import {createActionGroup, props} from "@ngrx/store";
import {Subscription} from "../../models/subscription";
import {EmptyProps} from "../../../base/util/ngrx";

export const ProfileActions = createActionGroup({
    source: "profile",
    events: {
        "Load Profile": props<EmptyProps>(),
        "Load Current Subscription": props<EmptyProps>(),
        "Update Current Subscription": props<{ subscription: Subscription }>(),
        "Update Username": props<{ username: string }>()
    }
});

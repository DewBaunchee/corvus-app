import {createActionGroup, props} from "@ngrx/store";
import {CorrectTokenAuthentication} from "../../../models/security/token-authentication";

export const SecurityActions = createActionGroup({
    source: "Security",
    events: {
        "Update Authentication": props<{ authentication: CorrectTokenAuthentication }>()
    }
});

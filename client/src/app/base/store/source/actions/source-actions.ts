import {createActionGroup, props} from "@ngrx/store";
import {registerActions} from "../../../../store/actions/app-actions";

export const SourceActions = createActionGroup({
    source: "sources",
    events: {
        "Download": props<{ id: number }>(),
    }
});

registerActions(SourceActions);

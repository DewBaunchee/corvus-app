import {createActionGroup, props} from "@ngrx/store";
import {registerActions} from "../../../store/actions/app-actions";

export const SourceActions = createActionGroup({
    source: "sources",
    events: {
        "Download": props<{ id: number }>(),
        "Validate Template": props<{ sourceId: number }>(),
    }
});

registerActions(SourceActions);

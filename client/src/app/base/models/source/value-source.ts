import {Source} from "./source";

export interface ValueSource extends Source<"VALUE"> {
    value: string;
}

export const createValueSource = (value: string): ValueSource => ({
    id: -1,
    type: "VALUE",
    value
});

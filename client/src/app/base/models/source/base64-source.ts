import {Source} from "./source";

export interface Base64Source extends Source<"BASE64"> {
    value: string;
}

export const createBase64Source = (value: string): Base64Source => ({
    id: -1,
    type: "BASE64",
    value
});

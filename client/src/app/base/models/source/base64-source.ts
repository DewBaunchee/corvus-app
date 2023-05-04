import {Source} from "./source";

export interface Base64Source extends Source<"BASE64"> {
    base64: string;
}

export const createBase64Source = (base64: string): Base64Source => ({
    id: -1,
    type: "BASE64",
    base64
});

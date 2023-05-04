import {Source} from "./source";

export interface UrlSource extends Source<"URL"> {
    url: string;
}

export const createUrlSource = (url: string): UrlSource => ({
    id: -1,
    type: "URL",
    url,
});

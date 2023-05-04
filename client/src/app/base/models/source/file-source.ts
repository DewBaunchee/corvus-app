import {Source} from "./source";

export interface FileSource extends Source<"FILE"> {
    name: string;
    loadingProgress: number;
    base64: string;
}

export const createFileSource = (file: File, progress: number): FileSource => ({
    id: -1,
    type: "FILE",
    name: file.name,
    loadingProgress: progress,
    base64: ""
});

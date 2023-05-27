import {Source} from "./source";

export interface FileSource extends Source<"FILE"> {
    name: string;
    loadingProgress: number;
}

export const createFileSource = (file: File, progress: number): FileSource => ({
    id: -1,
    type: "FILE",
    name: file.name,
    loadingProgress: progress,
});

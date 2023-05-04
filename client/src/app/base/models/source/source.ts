export type SourceType = "FILE" | "URL" | "VALUE" | "BASE64";

export interface Source<Type extends SourceType = SourceType> {
    id: number;
    type: Type;
}

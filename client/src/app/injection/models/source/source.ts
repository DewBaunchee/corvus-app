export type SourceType = "FILE";

export interface Source<Type extends SourceType = SourceType> {
    id: number;
    type: Type;
}

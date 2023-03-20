export class FileDecorator {

    constructor(public readonly file: File) {
    }

    public get name() {
        return this.file.name;
    }
}

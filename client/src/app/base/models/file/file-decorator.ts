export class FileDecorator {

    constructor(public readonly file: File) {
    }

    public get fullName() {
        return this.file.name;
    }

    public get extension() {
        const dotIndex = this.fullName.lastIndexOf(".");
        if (dotIndex === -1) return "";
        return this.fullName.substring(dotIndex + 1);
    }

    public toFile() {
        return this.file;
    }
}

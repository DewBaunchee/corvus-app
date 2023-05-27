import {Injectable} from "@angular/core";
import {ValidationErrors} from "@angular/forms";

@Injectable({
    providedIn: "root"
})
export class ValidationService {

    public getValidationMessages(errors: ValidationErrors | null): string[] {
        if (!errors) return [];

        const result: string[] = [];
        for (const errorsKey in errors) {
            const errorsValue = errors[errorsKey];
            if (errorsKey === "required") result.push("This field is required");
            if (errorsKey === "password.confirmation") result.push("Passwords doesn't match");
            if (errorsKey === "custom") result.push(...errorsValue);
        }
        return result;
    }
}

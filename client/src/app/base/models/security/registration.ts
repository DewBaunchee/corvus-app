import {Errors} from "../errors/errors";

export interface RegistrationResult {
    success: boolean;
    errors: Errors;
}

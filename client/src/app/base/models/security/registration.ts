import {Errors} from "../errors/errors";

export interface FormResult {
    success: boolean;
    errors: Errors;
}

import {Errors} from "../errors/errors";

export type TokenAuthentication = CorrectTokenAuthentication | IncorrectTokenAuthentication;

export interface CorrectTokenAuthentication {
    token: string;
    username: string;
    guestExpirationDate?: number;
    guest: boolean;
}

export interface IncorrectTokenAuthentication {
    errors: Errors;
}

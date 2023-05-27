import {CorrectTokenAuthentication} from "../../../models/security/token-authentication";

export interface SecurityState {
    authentication?: CorrectTokenAuthentication;
}

export const initialSecurityState = (): SecurityState => ({});

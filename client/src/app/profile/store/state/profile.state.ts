import {Subscription} from "../../models/subscription";

export interface ProfileState {
    username: string;
    email?: string;
    currentSubscription?: Subscription;
}

export const initialProfileState = (): ProfileState => ({
    username: "",
    email: undefined,
    currentSubscription: undefined
});

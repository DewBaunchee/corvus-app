import {Subscription} from "../../models/subscription";

export interface ProfileState {
    username: string;
    currentSubscription?: Subscription;
}

export const initialProfileState = (): ProfileState => ({
    username: "",
    currentSubscription: undefined
});

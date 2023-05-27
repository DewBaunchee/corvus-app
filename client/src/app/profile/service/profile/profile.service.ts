import {Injectable} from "@angular/core";
import {ProfileHttpService} from "./profile.http.service";

@Injectable()
export class ProfileService {

    constructor(private readonly http: ProfileHttpService) {
    }

    public loadCurrentSubscription() {
        return this.http.loadCurrentSubscription();
    }

    public provideEmail(email: string) {
        return this.http.provideEmail(email);
    }
}

import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Subscription} from "../../models/subscription";
import environment from "../../../../../env/environment";

@Injectable()
export class ProfileHttpService {

    private readonly root = `${environment.baseUrl}/api/profile`;

    constructor(private readonly http: HttpClient) {
    }

    public loadCurrentSubscription() {
        return this.http.get<Subscription>(
            `${this.root}/subscription/current`
        );
    }
}

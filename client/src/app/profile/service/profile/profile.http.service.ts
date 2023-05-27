import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Subscription} from "../../models/subscription";
import environment from "../../../../../env/environment";
import {map, Observable} from "rxjs";
import {FormResult} from "../../../base/models/security/registration";

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

    public loadEmail() {
        return this.http.get(
            `${this.root}/email/get`,
            {responseType: "text"}
        ).pipe(
            map(email => email ? email : undefined)
        );
    }

    public provideEmail(email: string): Observable<FormResult> {
        return this.http.post<FormResult>(
            `${this.root}/email/set`,
            {},
            {params: new HttpParams().set("email", email)}
        );
    }
}

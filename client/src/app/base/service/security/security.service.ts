import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import jwtDecode, {JwtPayload} from "jwt-decode";
import {map, Observable, of, switchMap, tap} from "rxjs";
import environment from "../../../../../env/environment";
import {AUTHORIZATION_HEADER, BASIC_PREFIX} from "../../../constants";
import {CorrectTokenAuthentication, TokenAuthentication} from "../../models/security/token-authentication";
import {NotificationService} from "../notification/notification.service";
import {RegistrationResult} from "../../models/security/registration";
import {AppState} from "../../../store/state/app-state";
import {Store} from "@ngrx/store";
import {SecurityActions} from "../../store/security/actions/security.actions";
import {selectAuthentication, selectSecurityState} from "../../store/security/selectors/security.selectors";
import {ProfileActions} from "../../../profile/store/actions/profile.actions";

const STORAGE_AUTH_KEY = "auth-token";
const STORAGE_USERNAME_KEY = "username";
const STORAGE_PASSWORD_KEY = "password";

@Injectable()
export class SecurityService {

    private readonly root = `${environment.baseUrl}/api/security`;

    private currentAuthentication?: CorrectTokenAuthentication;

    constructor(
        private readonly http: HttpClient,
        private readonly store: Store<AppState>,
        private readonly notification: NotificationService
    ) {
        this.store.select(selectAuthentication).subscribe(auth => {
            this.currentAuthentication = auth;
        });
    }

    public initialize() {
        this.loadSessionAuthentication();
        this.store.select(selectSecurityState).subscribe(({authentication}) => {
            if (!authentication) return;
            if (!this.isValidAuthentication(authentication)) return;

            this.store.dispatch(ProfileActions.loadProfile({}));
            this.store.dispatch(ProfileActions.updateUsername({username: authentication.username}));
        });
    }

    private loadSessionAuthentication() {
        const storageEntry = sessionStorage.getItem(STORAGE_AUTH_KEY);
        const authentication: CorrectTokenAuthentication = storageEntry ? JSON.parse(storageEntry) : null;
        this.store.dispatch(SecurityActions.updateAuthentication({authentication}));
    }

    public register(
        username: string,
        email: string | undefined | null,
        password: string
    ): Observable<RegistrationResult> {
        return this.http.post<RegistrationResult>(
            `${this.root}/register`,
            {username, email, password}
        );
    }

    private basicAuth(username: string, password: string) {
        return `${BASIC_PREFIX} ${btoa(`${username}:${password}`)}`;
    }

    public loginAny(): Observable<TokenAuthentication> {
        return this.loginSaved().pipe(
            switchMap(auth => {
                if ("errors" in auth) {
                    return this.loginLikeGuest();
                }
                return of(auth);
            })
        );
    }

    public loginSaved(): Observable<TokenAuthentication> {
        const username = sessionStorage.getItem(STORAGE_USERNAME_KEY);
        const password = sessionStorage.getItem(STORAGE_PASSWORD_KEY);

        if (username && password) return this.login(username, password);

        return of({
            errors: {
                "username": ["Username is not saved."],
                "password": ["Password is not saved."],
            }
        });
    }

    public login(username: string, password: string): Observable<TokenAuthentication> {
        return this.http.post<TokenAuthentication>(
            `${this.root}/login`,
            {},
            {
                headers: new HttpHeaders()
                    .set(AUTHORIZATION_HEADER, this.basicAuth(username, password))
            }
        ).pipe(tap(token => {
            if (!("errors" in token)) {
                sessionStorage.setItem(STORAGE_USERNAME_KEY, username);
                sessionStorage.setItem(STORAGE_PASSWORD_KEY, password);
                sessionStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(token));
                this.store.dispatch(SecurityActions.updateAuthentication({authentication: token}));
            }
        }));
    }

    public loginLikeGuest(username?: string | null): Observable<TokenAuthentication> {
        username = sessionStorage.getItem(STORAGE_USERNAME_KEY);
        return this.http.post<TokenAuthentication>(
            `${this.root}/login/guest`, {},
            {
                params: username ? new HttpParams().set("username", username) : new HttpParams()
            }
        ).pipe(tap(token => {
            if (!("errors" in token)) {
                sessionStorage.setItem(STORAGE_USERNAME_KEY, token.username);
                sessionStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(token));
                this.store.dispatch(SecurityActions.updateAuthentication({authentication: token}));
            }
        }));
    }

    public logout(): Observable<TokenAuthentication> {
        sessionStorage.removeItem(STORAGE_USERNAME_KEY);
        sessionStorage.removeItem(STORAGE_PASSWORD_KEY);
        sessionStorage.removeItem(STORAGE_AUTH_KEY);
        return this.loginLikeGuest();
    }

    public getAuth(): Observable<CorrectTokenAuthentication> {
        if (this.currentAuthentication) {
            if (this.isValidAuthentication(this.currentAuthentication)) {
                return of(this.currentAuthentication);
            } else {
                sessionStorage.removeItem(STORAGE_AUTH_KEY);
            }
        }

        return this.loginAny().pipe(
            map(token => {
                if ("errors" in token) {
                    const errorMessage = "Cannot authenticate.";
                    this.notification.showError(errorMessage);
                    throw new Error(errorMessage);
                }
                return token as CorrectTokenAuthentication;
            })
        );
    }

    public isValidAuthentication(auth: CorrectTokenAuthentication): boolean {
        const {exp}: JwtPayload = jwtDecode(auth.token);
        const tokenIsValid = !!exp && Date.now() < exp * 1000;
        const guestIsValid = !auth.guestExpirationDate || Date.now() < auth.guestExpirationDate;
        return tokenIsValid && guestIsValid;
    }
}

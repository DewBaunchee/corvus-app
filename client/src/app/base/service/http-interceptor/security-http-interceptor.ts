import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable, switchMap} from "rxjs";
import {SecurityService} from "../security/security.service";
import {AUTHORIZATION_HEADER, BEARER_PREFIX} from "../../../constants";

@Injectable()
export class SecurityHttpInterceptor implements HttpInterceptor {

    constructor(private readonly security: SecurityService) {
    }

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (
            request.url.endsWith("/login")
            || request.url.endsWith("/login/guest")
            || request.url.endsWith("/register")
        ) return next.handle(request);

        return this.security.getAuth().pipe(switchMap(auth => {
            return next.handle(request.clone({
                headers: request.headers.set(AUTHORIZATION_HEADER, `${BEARER_PREFIX} ${auth.token}`)
            }));
        }));
    }
}

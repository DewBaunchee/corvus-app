import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, EMPTY, Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {NotificationService} from "../notification/notification.service";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(private readonly notification: NotificationService) {
    }

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((err: HttpErrorResponse) => {
                if (err.error instanceof Error) {
                    this.notification.showError(err.error.message, "Client error");
                } else {
                    this.notification.showError(err.error.message, "Server error");
                }

                return EMPTY;
            })
        );
    }
}

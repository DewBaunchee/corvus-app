import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {Injectable} from "@angular/core";
import {NotificationService} from "../notification/notification.service";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(private readonly notification: NotificationService) {
    }

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError(({error}: HttpErrorResponse) => {
                if (error instanceof ProgressEvent) {
                    this.notification.showError("Server disconnected.");
                } else if (error instanceof Error) {
                    this.notification.showError(error.message);
                } else {
                    this.notification.showError(error);
                }

                return throwError(() => error);
            })
        );
    }
}

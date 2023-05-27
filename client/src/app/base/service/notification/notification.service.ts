import {Injectable} from "@angular/core";
import {Notification, NotificationPriority} from "../../models/notification/notification";
import {isPresent} from "../../util/functions";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable()
export class NotificationService {

    constructor(private readonly snackbar: MatSnackBar) {
    }

    public showError(message: string, title?: string) {
        this.show({
            priority: NotificationPriority.ERROR,
            message,
            title,
        });
    }

    public show(notification: Notification) {
        if (isPresent(notification.title))
            this.snackbar.open(notification.title + ": " + notification.message);
        else
            this.snackbar.open(notification.message);
    }

    public showDevError(message: string) {
        this.snackbar.open("Dev error: " + message);
        return new Error(message);
    }
}

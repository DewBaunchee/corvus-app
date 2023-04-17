import {Injectable} from "@angular/core";
import {Notification, NotificationPriority} from "../../models/notification/notification";
import {isPresent} from "../../util/functions";

@Injectable()
export class NotificationService {


    public showError(message: string, title?: string) {
        this.show({
            priority: NotificationPriority.ERROR,
            message,
            title,
        });
    }

    public show(notification: Notification) {
        if (isPresent(notification.title))
            alert(notification.title + ": " + notification.message);
        else
            alert(notification.message);
    }
}

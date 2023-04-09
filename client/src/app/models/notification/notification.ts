
export enum NotificationPriority {
    INFO = "INFO",
    WARN = "WARN",
    ERROR = "ERROR",
}

export interface Notification {
    priority: NotificationPriority;
    title?: string;
    message: string;
}

import {Injectable} from "@angular/core";
import {QueueMessage} from "../../models/websocket/queue-message";
import {NotificationService} from "../notification/notification.service";
import {AppState} from "../../../store/state/app-state";
import {Store} from "@ngrx/store";
import {InjectionQueueActions} from "../../../injection/store/actions/injection-actions";
import {RxStompService} from "./rx-stomp.service";
import {BehaviorSubject} from "rxjs";
import {RxStompState} from "@stomp/rx-stomp";

@Injectable()
export class WebSocketService {

    private readonly injectionQueue = "/injection-queue";

    private readonly _connected = new BehaviorSubject(false);

    constructor(
        private readonly stomp: RxStompService,
        private readonly notification: NotificationService,
        private readonly store: Store<AppState>
    ) {
        this._connected.next(this.stomp.connected());
        this.stomp.connected$.subscribe(state => {
            this._connected.next(state === RxStompState.OPEN);
        });

        this.stomp.watch(this.injectionQueue).subscribe(this.setReceiver(this.processQueueMessage));
    }

    private processQueueMessage(message: QueueMessage) {
        if (!message.queueId) {
            this.notification.showError("No queue id in queue message");
            return;
        }
        if (message.injections) {
            this.store.dispatch(InjectionQueueActions.setInjections({
                queueId: message.queueId,
                injections: message.injections
            }));
        }
        if (message.addedInjections) {
            this.store.dispatch(InjectionQueueActions.addInjections({
                queueId: message.queueId,
                injections: message.addedInjections
            }));
        }
        if (message.removedInjections) {
            this.store.dispatch(InjectionQueueActions.removeInjections({
                queueId: message.queueId,
                injections: message.removedInjections
            }));
        }
        if (message.updatedInjections) {
            this.store.dispatch(InjectionQueueActions.updateInjections({
                queueId: message.queueId,
                injections: message.updatedInjections
            }));
        }
        if (message.name) {
            this.store.dispatch(InjectionQueueActions.setName({
                queueId: message.queueId,
                name: message.name
            }));
        }
        if (message.status) {
            this.store.dispatch(InjectionQueueActions.setStatus({
                queueId: message.queueId,
                status: message.status
            }));
        }
    }

    public connected() {
        return this._connected.asObservable();
    }

    public isConnected() {
        return this._connected.getValue();
    }

    private setReceiver(receiver: (message: object) => void): (message: { body: string }) => void {
        return message => receiver.call(this, JSON.parse(message.body));
    }
}

import {RxStomp, RxStompConfig} from "@stomp/rx-stomp";
import environment from "../../../../../env/environment";
import * as SockJS from "sockjs-client";

export class RxStompService extends RxStomp {

    constructor() {
        super();
    }
}

export function rxStompServiceFactory() {
    const config: RxStompConfig = {
        webSocketFactory: () => new SockJS(`${environment.baseUrl}/socket`),
        heartbeatIncoming: 0,
        heartbeatOutgoing: 20000,
        reconnectDelay: 5000,
    };
    const rxStomp = new RxStompService();
    rxStomp.configure(config);
    rxStomp.activate();
    return rxStomp;
}

///<reference path="../../all.references.ts" />

"use strict";

module services {
    export class SocketService {
        public socket:any;

        static $inject = [
            injections.angular.$log,
            injections.extServices.socketFactory,
        ];

        constructor(private $log:ng.ILogService, private socketFactory:any) {
            // TODO: maybe get it from the index.html?!?
            var myIoSocket = io.connect(constants.ws);

            this.socket = socketFactory({
                ioSocket: myIoSocket
            });
        }
    }
}
///<reference path="../../all.references.ts" />

"use strict";

module services {
    export class SocketService {
        public socket:any;

        static $inject = [
            injections.services.loggerService,
            injections.extServices.socketFactory,
        ];

        constructor(private logger:services.LoggerService, private socketFactory:any) {
            this.socket = socketFactory();
            this.logger.info("web-socket created");
        }
    }
}
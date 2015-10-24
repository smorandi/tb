///<reference path="../all.references.ts" />

module services {
    export class SocketService {
        private socket:any;

        constructor(private socketFactory:any, private $log:ng.ILogService) {
            // TODO: maybe get it from the index.html?!?
            var myIoSocket = io.connect(constants.ws);

            this.socket = socketFactory({
                ioSocket: myIoSocket
            });
        }

        public getSocket():any {
            return this.socket;
        }
    }
}
///<reference path="../../all.references.ts" />

"use strict";

module services {
    export class DashboardService {
        public dashboard:Array<any>;

        static $inject = [
            injections.angular.$log,
            injections.services.apiService,
            injections.services.socketService,
        ];
        constructor(private $log:ng.ILogService, private apiService:services.ApiService, private socketService:services.SocketService) {

            this.dashboard = [];

            apiService.$load().then(res => {
                res.$get("dashboard").then(res => {
                    this.dashboard.length = 0;
                    res.forEach(item => this.dashboard.push(item));
                });
            });

            $log.info("registering websocket on dashboard-channel");
            socketService.socket.on("dashboard", data => {
                this.dashboard.length = 0;
                data.forEach(item => this.dashboard.push(item));
            });
        }
    }
}
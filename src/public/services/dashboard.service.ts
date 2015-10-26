///<reference path="../all.references.ts" />

module services {
    export class DashboardService {
        private dashboard:Array<any>;

        constructor(private apiService:services.ApiService, private socketService:services.SocketService, private $log:ng.ILogService) {

            this.dashboard = [];

            apiService.$load().then(res => {
                res.$get("dashboard").then(res => {
                    this.dashboard.length = 0;
                    res.forEach(item => this.dashboard.push(item));
                });
            });

            $log.info("registering websocket on dashboard-channel");
            socketService.getSocket().on("dashboard", data => {
                this.dashboard.length = 0;
                data.forEach(item => this.dashboard.push(item));
            });
        }

        public getDashboard():Array<any> {
            return this.dashboard;
        }
    }
}
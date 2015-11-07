///<reference path="../../all.references.ts" />

"use strict";

module services {
    export class DashboardService {
        public dashboard:Array<any> = [];

        static $inject = [
            injections.angular.$log,
            injections.services.apiService,
            injections.services.socketService,
            injections.extServices.lodash
        ];

        constructor(private $log:ng.ILogService, private apiService:services.ApiService, private socketService:services.SocketService, private _:_.LoDashStatic) {
            apiService.$load().then(res => {
                res.$get("dashboard").then(res => res.forEach(item => this.dashboard.push(item)));
            });

            $log.info("registering websocket on dashboard-channel");
            socketService.socket.on("dashboard", data => {
                // remove all items from dashboard which are not included in data anymore...
                this._.remove(this.dashboard, item => {
                    return !this._.find(this.dashboard, "id", item.id);
                });

                // add all items contained in data which are not yet in dashboard...
                this._.forEach(data, (item:any) => {

                    var dbItem = this._.find(this.dashboard, "id", item.id);
                    if (dbItem) {
                        dbItem.name = item.name;
                        dbItem.description = item.description;
                        dbItem.imageUrl = item.imageUrl;
                        dbItem.category = item.category;
                        dbItem.tags = item.tags;
                        dbItem.price = item.price;
                        dbItem.lowestPrice = item.lowestPrice;
                        dbItem.highestPrice = item.highestPrice;
                        dbItem.allTimeHigh = item.allTimeHigh;
                        dbItem.allTimeLow = item.allTimeLow;
                        dbItem.tick.price = item.tick.price;
                        dbItem.tick.delta = item.tick.delta;
                        dbItem.tick.reason = item.tick.reason;
                        dbItem.tick.timestamp = item.tick.timestamp;
                    }
                    else {
                        this.dashboard.push(item);
                    }
                });


                //data.forEach(item => {
                //    this.dashboard.push(item);
                //});
            });
        }
    }
}
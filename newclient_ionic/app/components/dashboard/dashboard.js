
var dashboardApp = (function () {

    'use strict';

    angular.module('TBApp.dashboard', ['ngAnimate', 'ionic', 'DrinkAppDataServices' ])

        .controller('DashboardController', ['$log', 'dataService',
            function($log, dataService ){
                $log.log("DashboardController");

                var self = this;

                //self.list = dataService.getDashboard();

                self.init = function(){
                    dataService.dashboardSrv.readDashboardFromUrl(dataService.menuSrv.getMenuUrl("dashboard"));
                };

                dataService.menuSrv.subscribeMenuInit(self.init);

                self.list = dataService.dashboardSrv.getDashboardList();

            }]);

}());
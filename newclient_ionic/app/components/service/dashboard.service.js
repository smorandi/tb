var DrinkAppDrinksServices = angular.module('DashboardServices', ['ngResource']);

DrinkAppDrinksServices.service('dashboardService', ['$log', '$http', '$resource',
    function ($log, $http, $resource) {
        $log.log("dashboard service");

        var self = this;

        self.dashboardList = {};
        self.dashboardObj = {};

        self.readDashboardFromUrl = function(url) {
            self.dashboardObj = $resource(url + '/:Id', {Id:'@id'});
            self.dashboardList.data = self.dashboardObj.query(function(){
                $log.log(self.dashboardList);
            });
        };

        self.getDashboardList = function(){
            return self.dashboardList;
        };

        self.getDashboardItem = function(itemId) {
          return  self.dashboardObj.get({Id: itemId});
        };

    }]);

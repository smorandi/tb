var DrinkAppCustomerServices = angular.module('CustomerServices', ['ngResource']);

DrinkAppCustomerServices.service('customerService', ['$log', '$http', '$resource',
    function ($log, $http, $resource) {
        $log.log("customer service");

        var self = this;

        self.customerList = {};
        self.customerObj = {};

        self.readCustomerFromUrl = function (url) {
            self.customerObj = $resource(url + '/:Id', {Id: '@id'});
            self.customerList.data = self.customerObj.query(function () {
                $log.log(self.customerList.data);
            });
        };

        self.getCustomerList = function () {
            return self.customerList;
        };

        self.getCustomersItem = function (itemId) {
            return self.customerObj.get({Id: itemId});
        };

        self.deleteCustomerItem = function (itemId) {
            var item = self.customerObj.get({Id: itemId}, function () {
                item.$delete(function () {
                });
            });

        };

        self.updateCustomerItem = function (itemId, data) {
            var item = self.customerObj.get({Id: itemId}, function () {
                item.data = data;
                item.$update(function () {
                });
            });
        };

    }]);

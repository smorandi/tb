var DrinkAppDrinksServices = angular.module('DrinksServices', ['ngResource']);

DrinkAppDrinksServices.service('drinksService', ['$log', '$http', '$resource',
    function ($log, $http, $resource) {
        $log.log("drinks service");

        var self = this;

        self.drinksList = {};
        self.drinksObj = {};

        self.readDrinksFromUrl = function (url) {
            self.drinksObj = $resource(url + '/:Id', {Id: '@id'});
            self.drinksList.data = self.drinksObj.query(function () {
                $log.log(self.drinksList.data);
            });
        };

        self.getDrinksList = function () {
            return self.drinksList;
        };

        self.getDrinksItem = function (itemId) {
            return self.drinksObj.get({Id: itemId});
        };

        self.deleteDrinksItem = function (itemId) {
            var item = self.drinksObj.get({Id: itemId}, function () {
                item.$delete(function () {
                });
            });

        };

        self.updateDrinksItem = function (itemId, data) {
            var item = self.drinksObj.get({Id: itemId}, function () {
                item.data = data;
                item.$update(function () {
                });
            });
        };

    }]);

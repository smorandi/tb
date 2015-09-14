///<reference path="../../../../typings/tsd.d.ts" />
///<reference path="../../home/home-module.ts" />
var drinks;
(function (drinks) {
    "use strict";
    angular.module("drinks").config(function ($stateProvider) {
        $stateProvider.state("home.drinks", {
            url: "drinks",
            abstract: true,
            templateUrl: "modules/drinks/views/drinks-root.html",
            resolve: {
                drinksResource: function ($log, homeResource, $state) {
                    $log.info("resolving drinks-resource...");
                    return homeResource.$get("drinks").then(function (res) {
                        $log.info("drinks-resource resolved...");
                        return res;
                    });
                },
                drinkResources: function ($log, drinksResource) {
                    $log.info("resolving drink-resources...");
                    if (!drinksResource.$has("items")) {
                        $log.info("no drink resources found. returning empty array...");
                        return [];
                    }
                    return drinksResource.$get("items").then(function (res) {
                        $log.info("drink-resources resolved...");
                        return res;
                    }, function (err) {
                        $log.info("no collection in drinksResource");
                        return null;
                    });
                }
            }
        }).state("home.drinks.newDrink", {
            url: "/new",
            views: {
                "@home.drinks": {
                    templateUrl: "modules/drinks/views/drink-add.html",
                    controller: "DrinkCreateController",
                    controllerAs: "vm"
                }
            }
        }).state("home.drinks.overview", {
            url: "",
            abstract: true,
            templateUrl: "modules/drinks/views/drinks-overview.html"
        }).state("home.drinks.overview.list", {
            url: "",
            views: {
                "mas@home.drinks.overview": {
                    templateUrl: "modules/drinks/views/drink-list.html",
                    controller: "DrinkListController",
                    controllerAs: "vm"
                },
                "det@home.drinks.overview": {
                    templateUrl: "modules/drinks/views/drink-view.html"
                }
            }
        }).state("home.drinks.overview.list.detail", {
            resolve: {
                utilsService: "utilsService",
                drinkResource: function ($log, drinkResources, $location, $state, $stateParams, utilsService) {
                    var drinkResource = utilsService.findInArray(drinkResources, function (dr) { return dr.id === $stateParams["id"]; });
                    $log.info("resolving drink-resource...");
                    return drinkResource.$get("self").then(function (res) {
                        $log.info("drink-resource resolved...");
                        return res;
                    });
                }
            },
            url: "/{id}",
            views: {
                "det@home.drinks.overview": {
                    templateUrl: "modules/drinks/views/drink-view.html",
                    controller: "DrinkViewController",
                    controllerAs: "vm"
                }
            }
        }).state("home.drinks.overview.list.detail.editDrink", {
            url: "/edit",
            views: {
                "@home.drinks": {
                    templateUrl: "modules/drinks/views/drink-edit.html",
                    controller: "DrinkEditController",
                    controllerAs: "vm"
                }
            }
        });
    });
})(drinks || (drinks = {}));
//# sourceMappingURL=drinks-routes.js.map
///<reference path="../../../../typings/tsd.d.ts" />
///<reference path="../../home/home-module.ts" />

module drinks {
    "use strict";

    angular.module("drinks").config(($stateProvider) => {
            $stateProvider.state("home.drinks", {
                url: "drinks",
                abstract: true,
                templateUrl: "modules/drinks/views/drinks-root.html",
                resolve: {
                    drinksResource: ($log, homeResource, $state) => {
                        $log.info("resolving drinks-resource...");
                        return homeResource.$get("drinks").then(res => {
                            $log.info("drinks-resource resolved...");
                            return res;
                        });
                    },

                    drinkResources: ($log, drinksResource) => {
                        $log.info("resolving drink-resources...");
                        if(!drinksResource.$has("collection")){
                            $log.info("no drink resources found. returning empty array...");
                            return [];
                        }
                        return drinksResource.$get("collection").then(res => {
                            $log.info("drink-resources resolved...");
                            return res;
                        }, err => {
                            $log.info("no collection in drinksResource");
                            return null;
                        });
                    }
                },
            }).state("home.drinks.newDrink", { //state for adding a new drink
                url: "/new",
                views: {
                    "@home.drinks": {
                        templateUrl: "modules/drinks/views/drink-add.html",
                        controller: "DrinkCreateController",
                        controllerAs: "vm",
                    }
                },
            }).state("home.drinks.overview", {
                url: "",
                abstract: true,
                templateUrl: "modules/drinks/views/drinks-overview.html",
            }).state("home.drinks.overview.list", { // state for showing all drinks
                url: "",
                views: {
                    "mas@home.drinks.overview": {
                        templateUrl: "modules/drinks/views/drink-list.html",
                        controller: "DrinkListController",
                        controllerAs: "vm",
                    },
                    "det@home.drinks.overview": {
                        templateUrl: "modules/drinks/views/drink-view.html",
                    }
                }
            }).state("home.drinks.overview.list.detail", { //state for showing single drink
                resolve: {
                    utilsService: "utilsService",
                    drinkResource: ($log, drinkResources:Array<any>, $location, $state:ng.ui.IStateService, $stateParams:ng.ui.IStateParamsService, utilsService:home.UtilsService) => {
                        var drinkResource = utilsService.findInArray(drinkResources, dr => dr.id === $stateParams["id"]);
                        $log.info("resolving drink-resource...");
                        return drinkResource.$get("self").then(res => {
                            $log.info("drink-resource resolved...");
                            return res;
                        });
                    },
                },
                url: "/{id}",
                views: {
                    "det@home.drinks.overview": {
                        templateUrl: "modules/drinks/views/drink-view.html",
                        controller: "DrinkViewController",
                        controllerAs: "vm",
                    }
                },
            }).state("home.drinks.overview.list.detail.editDrink", { //state for updating a drink
                url: "/edit",
                views: {
                    "@home.drinks": {
                        templateUrl: "modules/drinks/views/drink-edit.html",
                        controller: "DrinkEditController",
                        controllerAs: "vm",
                    }
                },
            });
        }
    );
}
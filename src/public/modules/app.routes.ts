///<reference path="../all.references.ts" />

module modules {
    "use strict";

    angular.module("app").config(["$stateProvider", "$urlRouterProvider",
        ($stateProvider, $urlRouterProvider) => {
            // Redirect to home view when route not found
            $urlRouterProvider.otherwise("/dashboard");

            // Home state routing
            $stateProvider
                .state("root", {
                    abstract: true,
                    url: "",
                    templateUrl: "modules/root/root.html",
                    resolve: {
                        apiService: "apiService",
                        pageService: "pageService",
                        rootResource: ($log, apiService:services.ApiService, pageService:services.PageService) => {
                            $log.info("resolving root-resource...");
                            return apiService.$load().then(res => {
                                $log.info("root-resource resolved...");
                                pageService.setResource(res);
                                return res;
                            });
                        }
                    },
                })
                .state("root.dashboard", {
                    url: "/dashboard",
                    views: {
                        "content@root": {
                            templateUrl: "modules/dashboard/dashboard.html",
                            controller: "DashboardController as vm",
                        }
                    }
                })
                .state("root.home", {
                    url: "/home",
                    resolve: {
                        pageService: "pageService",
                        homeResource: ($log, rootResource, pageService:services.PageService) => {
                            $log.info("resolving home-resource...");

                            if (!rootResource.$has("home")) {
                                $log.info("no home resources found. returning empty array...");
                                return [];
                            }

                            return rootResource.$get("home").then(res => {
                                $log.info("home-resource resolved...");
                                pageService.setResource(res);
                                return res;
                            });
                        },
                    },
                })
                //.state("root.home.dashboard", {
                //    url: "/dashboard",
                //    views: {
                //        "content@root": {
                //            templateUrl: "modules/dashboard/dashboard.html",
                //            controller: "DashboardController as vm",
                //        }
                //    }
                //})
                .state("root.home.system", {
                    url: "/system",
                    views: {
                        "content@root": {
                            templateUrl: "modules/system/system.html",
                            controller: "SystemController as vm",
                        }
                    },
                    resolve: {
                        systemResource: ($log, homeResource) => {
                            $log.info("resolving system-resource...");
                            return homeResource.$get("system").then(res => {
                                $log.info("system-resource resolved...");
                                return res;
                            });
                        },
                    },
                })
                .state("root.home.drinks", {
                    url: "/drinks",
                    abstract: true,
                    views: {
                        "content@root": {
                            templateUrl: "modules/drinks/views/drinks-root.html",
                        }
                    },
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
                            if (!drinksResource.$has("items")) {
                                $log.info("no drink resources found. returning empty array...");
                                return [];
                            }
                            return drinksResource.$get("items").then(res => {
                                $log.info("drink-resources resolved...");
                                return res;
                            }, err => {
                                $log.info("no collection in drinksResource");
                                return null;
                            });
                        }
                    },
                })
                .state("root.home.drinks.newDrink", { //state for adding a new drink
                    url: "/new",
                    views: {
                        "@root.home.drinks": {
                            templateUrl: "modules/drinks/views/drink-add.html",
                            controller: "DrinkCreateController as vm",
                        }
                    },
                })
                .state("root.home.drinks.overview", {
                    url: "",
                    abstract: true,
                    templateUrl: "modules/drinks/views/drinks-overview.html",
                })
                .state("root.home.drinks.overview.list", { // state for showing all drinks
                    url: "",
                    views: {
                        "mas@root.home.drinks.overview": {
                            templateUrl: "modules/drinks/views/drink-list.html",
                            controller: "DrinkListController as vm",
                        },
                        "det@root.home.drinks.overview": {
                            templateUrl: "modules/drinks/views/drink-view.html",
                        }
                    }
                })
                .state("root.home.drinks.overview.list.detail", { //state for showing single drink
                    url: "/:id",
                    views: {
                        "det@root.home.drinks.overview": {
                            templateUrl: "modules/drinks/views/drink-view.html",
                            controller: "DrinkViewController as vm",
                        }
                    },
                    resolve: {
                        utilsService: "utilsService",
                        drinkResource: ($log, drinkResources:Array<any>, $location, $state:ng.ui.IStateService, $stateParams:ng.ui.IStateParamsService, utilsService:services.UtilsService) => {
                            var drinkResource = utilsService.findInArray(drinkResources, dr => dr.id === $stateParams["id"]);
                            return drinkResource;
                            //$log.info("resolving drink-resource...");
                            //return drinkResource.$get("self").then(res => {
                            //    $log.info("drink-resource resolved...");
                            //    return res;
                            //});
                        },
                    },
                })
                .state("root.home.drinks.overview.list.detail.editDrink", { //state for updating a drink
                    url: "/edit",
                    views: {
                        "@root.home.drinks": {
                            templateUrl: "modules/drinks/views/drink-edit.html",
                            controller: "DrinkEditController as vm",
                        }
                    },
                });
        }
    ]);
}
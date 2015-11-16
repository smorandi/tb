///<reference path="../../all.references.ts" />

"use strict";

module config {
    export class RoutesConfig {
        static $inject = [
            injections.uiRouter.$stateProvider,
            injections.uiRouter.$urlRouterProvider,
        ];

        constructor($stateProvider:ng.ui.IStateProvider, $urlRouterProvider:ng.ui.IUrlRouterProvider) {
            $urlRouterProvider.otherwise("/dashboard");

            $stateProvider
                .state("root", {
                    url: "",
                    templateUrl: "components/root/root.html",
                    abstract: true,
                    resolve: {
                        apiService: "apiService",
                        menuService: "menuService",
                        authService: "authService",
                        rootResource: ($log, apiService:services.ApiService, menuService:services.MenuService, authService:services.AuthService) => {
                            $log.info("resolving root-resource...");
                            return apiService.$load().then(res => {
                                $log.info("root-resource resolved...");
                                if (authService.getToken() && res.$has("home")) {
                                    return res.$get("home")
                                        .then(resHome => {
                                            $log.info("home-resource resolved...");
                                            menuService.setResource(resHome);
                                            return res;
                                        })
                                        .catch(err => {
                                            authService.clearCredentials();
                                            menuService.setResource(res);
                                            return res;
                                        });
                                } else {
                                    menuService.setResource(res);
                                    return res;
                                }
                            });
                        }
                    },
                })
                .state("root.dashboard", {
                    url: "/dashboard",
                    views: {
                        "content@root": {
                            templateUrl: injections.templates.dashboard,
                            controller: injections.controllers.dashboard,
                            controllerAs: "vm"
                        }
                    },
                })
                .state("root.register", {
                    url: "/register",
                    views: {
                        "content@root": {
                            templateUrl: injections.templates.register,
                            controller: injections.controllers.register,
                            controllerAs: "vm"
                        }
                    },
                })
                .state("root.home", {
                    url: "/home",
                    ["redirectTo"]: "root.dashboard",
                    resolve: {
                        menuService: "menuService",
                        homeResource: ($log, rootResource, menuService:services.MenuService) => {
                            $log.info("resolving home-resource...");

                            if (!rootResource.$has("home")) {
                                $log.info("no home resources found. returning empty array...");
                                return [];
                            }

                            return rootResource.$get("home").then(res => {
                                $log.info("home-resource resolved...");
                                menuService.setResource(res);
                                return res;
                            });
                        },
                    },
                })
                .state("root.home.system", {
                    url: "/system",
                    views: {
                        "content@root": {
                            templateUrl: injections.templates.system,
                            controller: injections.controllers.system,
                            controllerAs: "vm"
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
                            templateUrl: injections.templates.drinks.root,
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
                            return drinksResource.$get("items")
                                .then(res => {
                                    $log.info("drink-resources resolved...");
                                    return res;
                                })
                                .catch(err => {
                                    $log.info("no collection in drinksResource");
                                    return null;
                                });
                        },
                    },
                })
                .state("root.home.drinks.newDrink", { //state for adding a new drink
                    url: "/new",
                    views: {
                        "@root.home.drinks": {
                            templateUrl: injections.templates.drinks.create,
                            controller: injections.controllers.drinks.create,
                            controllerAs: "vm"
                        }
                    },
                })
                .state("root.home.drinks.overview", {
                    url: "",
                    abstract: true,
                    templateUrl: injections.templates.drinks.overview,
                })
                .state("root.home.drinks.overview.list", { // state for showing all drinks
                    url: "",
                    views: {
                        "mas@root.home.drinks.overview": {
                            templateUrl: injections.templates.drinks.list,
                            controller: injections.controllers.drinks.list,
                            controllerAs: "vm"
                        },
                        "det@root.home.drinks.overview": {
                            templateUrl: injections.templates.drinks.details,
                        }
                    }
                })
                .state("root.home.drinks.overview.list.details", { //state for showing single drink
                    url: "/:id",
                    views: {
                        "det@root.home.drinks.overview": {
                            templateUrl: injections.templates.drinks.details,
                            controller: injections.controllers.drinks.details,
                            controllerAs: "vm"
                        }
                    },
                    resolve: {
                        utilsService: "utilsService",
                        drinkResource: ($log, drinkResources:Array<any>, $location, $state:ng.ui.IStateService, $stateParams:ng.ui.IStateParamsService, utilsService:services.UtilsService) => {
                            var drinkResource = utilsService.findInArray(drinkResources, dr => dr.id === $stateParams["id"]);
                            return drinkResource;
                        },
                    },
                })
                .state("root.home.drinks.overview.list.details.editDrink", { //state for updating a drink
                    url: "/edit",
                    views: {
                        "@root.home.drinks": {
                            templateUrl: injections.templates.drinks.edit,
                            controller: injections.controllers.drinks.edit,
                            controllerAs: "vm"
                        }
                    },
                })
                .state("root.home.profile", {
                    url: "/profile",
                    views: {
                        "content@root": {
                            templateUrl: injections.templates.profile,
                            controller: injections.controllers.profile,
                            controllerAs: "vm"
                        }
                    },
                    resolve: {
                        profileResource: ($log, homeResource) => {
                            $log.info("resolving profile-resource...");
                            return homeResource.$get("profile").then(res => {
                                $log.info("profile-resource resolved...");
                                return res;
                            });
                        },
                    },
                })
                .state(constants.STATES.basket, {
                    url: "/basket",
                    views: {
                        "content@root": {
                            templateUrl: injections.templates.basket,
                            controller: injections.controllers.basket,
                            controllerAs: "vm"
                        }
                    },
                    resolve: {
                        basketResource: ($log, homeResource) => {
                            $log.info("resolving basket-resource...");
                            return homeResource.$get("basket").then(res => {
                                $log.info("basket-resource resolved...");
                                return res;
                            });
                        },
                        basketResourceItems: ($log, basketResource) => {
                            return basketResource.$get("items").then(res => {
                                $log.info("basket-resource-items resolved...");
                               return res;
                            });
                        },
                    }
                })
                .state("root.home.orders", {
                    url: "/orders",
                    abstract: true,
                    views: {
                        "content@root": {
                            templateUrl: injections.templates.orders.root,
                        }
                    },
                    resolve: {
                        ordersResource: ($log, homeResource, $state) => {
                            $log.info("resolving orders-resource...");
                            return homeResource.$get("orders").then(res => {
                                $log.info("orders-resource resolved...");
                                return res;
                            });
                        },

                        orderResources: ($log, ordersResource) => {
                            $log.info("resolving order-resources...");
                            if (!ordersResource.$has("items")) {
                                $log.info("no order resources found. returning empty array...");
                                return [];
                            }
                            return ordersResource.$get("items")
                                .then(res => {
                                    $log.info("order-resources resolved...");
                                    return res;
                                })
                                .catch(err => {
                                    $log.info("no collection in ordersResource");
                                    return null;
                                });
                        },
                    },
                })
                .state("root.home.orders.list", {
                    url: "",
                    views: {
                        "@root.home.orders": {
                            templateUrl: injections.templates.orders.list,
                            controller: injections.controllers.orders.list,
                            controllerAs: "vm"
                        }
                    }
                })
                .state("root.home.orders.list.details", {
                    url: "/:id",
                    views: {
                        "@root.home.orders": {
                            templateUrl: injections.templates.orders.details,
                            controller: injections.controllers.orders.details,
                            controllerAs: "vm"
                        }
                    },
                    resolve: {
                        utilsService: "utilsService",
                        orderResource: ($log, orderResources:Array<any>, $location, $state:ng.ui.IStateService, $stateParams:ng.ui.IStateParamsService, utilsService:services.UtilsService) => {
                            var orderResource = utilsService.findInArray(orderResources, dr => dr.id === $stateParams["id"]);
                            return orderResource;
                        },
                    },
                });
        }
    }
}
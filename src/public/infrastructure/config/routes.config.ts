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
                    templateUrl: injections.components.root.template,
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
                            templateUrl: injections.components.page.dashboard.template,
                            controller: injections.components.page.dashboard.controller,
                            controllerAs: "vm"
                        }
                    },
                })
                .state("root.register", {
                    url: "/register",
                    views: {
                        "content@root": {
                            templateUrl: injections.components.page.register.template,
                            controller: injections.components.page.register.controller,
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
                            templateUrl: injections.components.page.system.template,
                            controller: injections.components.page.system.controller,
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
                            templateUrl: injections.components.page.drinks.root.template,
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
                            templateUrl: injections.components.page.drinks.create.template,
                            controller: injections.components.page.drinks.create.controller,
                            controllerAs: "vm"
                        }
                    },
                })
                .state("root.home.drinks.overview", {
                    url: "",
                    abstract: true,
                    templateUrl: injections.components.page.drinks.overview.template,
                })
                .state("root.home.drinks.overview.list", { // state for showing all drinks
                    url: "",
                    views: {
                        "mas@root.home.drinks.overview": {
                            templateUrl: injections.components.page.drinks.list.template,
                            controller: injections.components.page.drinks.list.controller,
                            controllerAs: "vm"
                        },
                        "det@root.home.drinks.overview": {
                            templateUrl: injections.components.page.drinks.details.template,
                        }
                    }
                })
                .state("root.home.drinks.overview.list.details", { //state for showing single drink
                    url: "/:id",
                    views: {
                        "det@root.home.drinks.overview": {
                            templateUrl: injections.components.page.drinks.details.template,
                            controller: injections.components.page.drinks.details.controller,
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
                            templateUrl: injections.components.page.drinks.edit.template,
                            controller: injections.components.page.drinks.edit.controller,
                            controllerAs: "vm"
                        }
                    },
                })
                .state("root.home.profile", {
                    url: "/profile",
                    views: {
                        "content@root": {
                            templateUrl: injections.components.page.profile.template,
                            controller: injections.components.page.profile.controller,
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
                            templateUrl: injections.components.page.basket.template,
                            controller: injections.components.page.basket.controller,
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
                            templateUrl: injections.components.page.orders.root.template,
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
                            templateUrl: injections.components.page.orders.list.template,
                            controller: injections.components.page.orders.list.controller,
                            controllerAs: "vm"
                        }
                    }
                })
                .state("root.home.orders.list.details", {
                    url: "/:id",
                    views: {
                        "@root.home.orders": {
                            templateUrl: injections.components.page.orders.details.template,
                            controller: injections.components.page.orders.details.controller,
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
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
                        rootResource: ($log, apiService:services.ApiService, menuService:services.MenuService) => {
                            $log.info("resolving root-resource...");
                            return apiService.$load().then(res => {
                                $log.info("root-resource resolved...");
                                menuService.setResource(res);
                                return res;
                            });
                        }
                    },
                })
                .state("root.dashboard", {
                    url: "/dashboard",
                    views: {
                        "content@root": {
                            templateUrl: "components/dashboard/dashboard.html",
                            controller: injections.controllers.dashboard,
                            controllerAs: "vm"
                        }
                    }
                })
                .state("root.register", {
                    url: "/register",
                    views: {
                        "content@root": {
                            templateUrl: injections.templates.register.template,
                            controller: injections.controllers.register,
                            controllerAs: "vm"
                        }
                    }
                })
                .state("root.home", {
                    url: "/home",
                    redirectTo: "root.dashboard",
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
                            templateUrl: "components/system/system.html",
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
                            templateUrl: "components/drinks/drinks-root.html",
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
                            templateUrl: "components/drinks/create/drink-create.html",
                            controller: injections.controllers.drinks.create,
                            controllerAs: "vm"
                        }
                    },
                })
                .state("root.home.drinks.overview", {
                    url: "",
                    abstract: true,
                    templateUrl: "components/drinks/drinks-overview.html",
                })
                .state("root.home.drinks.overview.list", { // state for showing all drinks
                    url: "",
                    views: {
                        "mas@root.home.drinks.overview": {
                            templateUrl: "components/drinks/list/drink-list.html",
                            controller: injections.controllers.drinks.list,
                            controllerAs: "vm"
                        },
                        "det@root.home.drinks.overview": {
                            templateUrl: "components/drinks/details/drink-details.html",
                        }
                    }
                })
                .state("root.home.drinks.overview.list.details", { //state for showing single drink
                    url: "/:id",
                    views: {
                        "det@root.home.drinks.overview": {
                            templateUrl: "components/drinks/details/drink-details.html",
                            controller: injections.controllers.drinks.details,
                            controllerAs: "vm"
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
                .state("root.home.drinks.overview.list.details.editDrink", { //state for updating a drink
                    url: "/edit",
                    views: {
                        "@root.home.drinks": {
                            templateUrl: "components/drinks/edit/drink-edit.html",
                            controller: injections.controllers.drinks.edit,
                            controllerAs: "vm"
                        }
                    },
                })
                .state("root.home.profile", {
                    url: "/profile",
                    views: {
                        "content@root": {
                            templateUrl: "components/profile/profile.html",
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
                .state("root.home.basket", {
                    url: "/basket",
                    views: {
                        "content@root": {
                            templateUrl: "components/basket/basket.html",
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
                    },
                })
                .state("root.home.orders", {
                    url: "/orders",
                    abstract: true,
                    views: {
                        "content@root": {
                            templateUrl: "components/orders/orders-root.html",
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
                            return ordersResource.$get("items").then(res => {
                                $log.info("order-resources resolved...");
                                return res;
                            }, err => {
                                $log.info("no collection in ordersResource");
                                return null;
                            });
                        }
                    },
                })
                .state("root.home.orders.overview", {
                    url: "",
                    abstract: true,
                    templateUrl: "components/orders/orders-overview.html",
                })
                .state("root.home.orders.overview.list", {
                    url: "",
                    views: {
                        "mas@root.home.orders.overview": {
                            templateUrl: "components/orders/list/orders-list.html",
                            controller: injections.controllers.orders.list,
                            controllerAs: "vm"
                        },
                        "det@root.home.orders.overview": {
                            templateUrl: "components/orders/details/order-details.html",
                        }
                    }
                })
                .state("root.home.orders.overview.list.details", {
                    url: "/:id",
                    views: {
                        "det@root.home.orders.overview": {
                            templateUrl: "components/orders/details/order-details.html",
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
                })
            ;
        }
    }
}
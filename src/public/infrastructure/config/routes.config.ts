///<reference path="../../all.references.ts" />

"use strict";

module config {
    import IDeferred = angular.IDeferred;
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
                        logger: injections.services.loggerService,
                        apiService: injections.services.apiService,
                        menuService: injections.services.menuService,
                        authService: injections.services.authService,
                        dashboardService: injections.services.dashboardService,
                        $q: injections.angular.$qService,
                        rootResource: (logger:services.LoggerService,
                                       apiService:services.ApiService,
                                       menuService:services.MenuService,
                                       authService:services.AuthService,
                                       dashboardService:services.DashboardService,
                                       $q:ng.IQService) => {
                            logger.info("resolving root-resource...");
                            return apiService.$load().then(rootResource => {
                                logger.info("root-resource resolved...");

                                var requests = [];

                                var deferredHome = $q.defer();
                                if (authService.getToken() && rootResource.$has("home")) {
                                    rootResource.$get("home")
                                        .then(resHome => {
                                            logger.info("home-resource resolved...");
                                            deferredHome.resolve(resHome);
                                        })
                                        .catch(err => {
                                            logger.error("home-resource cannot be resolved...");
                                            authService.clearCredentials();
                                            deferredHome.resolve(rootResource);
                                        });
                                } else {
                                    deferredHome.resolve(rootResource);
                                }
                                requests.push(deferredHome.promise);

                                var deferredDashboard = $q.defer();
                                rootResource.$get("dashboard")
                                    .then(dashboardResource => {
                                        logger.info("dashboard-resource resolved...");
                                        deferredDashboard.resolve(dashboardResource);
                                    }).catch(err => deferredDashboard.reject(err));
                                requests.push(deferredDashboard.promise);

                                var deferredAll = $q.defer();
                                $q.all(requests).then((ret:any) => {
                                    menuService.setResource(ret[0]);
                                    dashboardService.setDashboard(ret[1]);
                                    deferredAll.resolve(rootResource);
                                }).catch(err => {
                                    deferredAll.reject(err);
                                });
                                return deferredAll.promise;
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
                    resolve: {
                        logger: injections.services.loggerService,
                        dashboardService: injections.services.dashboardService,

                        dashboardResource: (logger:services.LoggerService,
                                            dashboardService:services.DashboardService,
                                            rootResource) => {
                            logger.info("resolving dashboard-resource...");
                            return rootResource.$get("dashboard").then(dashboardResource => {
                                logger.info("dashboard-resource resolved...");
                                dashboardService.setDashboard(dashboardResource);
                                return dashboardResource;
                            });
                        },
                    }
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
                        logger: injections.services.loggerService,
                        menuService: injections.services.menuService,
                        homeResource: (logger:services.LoggerService, rootResource, menuService:services.MenuService) => {
                            logger.info("resolving home-resource...");

                            if (!rootResource.$has("home")) {
                                logger.info("no home resources found. returning empty array...");
                                return [];
                            }

                            return rootResource.$get("home").then(res => {
                                logger.info("home-resource resolved...");
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
                        logger: injections.services.loggerService,
                        systemResource: (logger:services.LoggerService, homeResource) => {
                            logger.info("resolving system-resource...");
                            return homeResource.$get("system").then(res => {
                                logger.info("system-resource resolved...");
                                return res;
                            });
                        },
                    },
                })
                .state("root.home.users", {
                    url: "/users",
                    views: {
                        "content@root": {
                            templateUrl: injections.components.page.users.template,
                            controller: injections.components.page.users.controller,
                            controllerAs: "vm"
                        }
                    },
                    resolve: {
                        logger: injections.services.loggerService,
                        usersResource: (logger:services.LoggerService, homeResource) => {
                            logger.info("resolving users-resource...");
                            return homeResource.$get("users").then(res => {
                                logger.info("users-resource resolved...");
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
                        utilsService: injections.services.utilsService,
                        drinkResource: ($log, drinkResources:Array<any>, $location, $state:ng.ui.IStateService, $stateParams:ng.ui.IStateParamsService, utilsService:services.UtilsService) => {
                            var drinkResource = utilsService.findInArray(drinkResources, dr => dr.id === $stateParams["id"]);
                            return drinkResource;
                        },
                    },
                })
                .state("root.home.drinks.overview.list.details.editDrink", { //state for updating a drink
                    url: "/edit",
                    views: {
                        "det@root.home.drinks.overview": {
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
                        utilsService: injections.services.utilsService,
                        orderResource: ($log, orderResources:Array<any>, $location, $state:ng.ui.IStateService, $stateParams:ng.ui.IStateParamsService, utilsService:services.UtilsService) => {
                            var orderResource = utilsService.findInArray(orderResources, dr => dr.id === $stateParams["id"]);
                            return orderResource;
                        },
                    },
                });
        }
    }
}
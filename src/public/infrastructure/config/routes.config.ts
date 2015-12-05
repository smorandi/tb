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
                .state(constants.STATES.root, {
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
                .state(constants.STATES.dashboard, {
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
                .state(constants.STATES.register, {
                    url: "/register",
                    views: {
                        "content@root": {
                            templateUrl: injections.components.page.register.template,
                            controller: injections.components.page.register.controller,
                            controllerAs: "vm"
                        }
                    },
                })
                .state(constants.STATES.home, {
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
                .state(constants.STATES.system, {
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
                .state(constants.STATES.users, {
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
                .state(constants.STATES.drinks.root, {
                    url: "/drinks",
                    abstract: true,
                    views: {
                        "content@root": {
                            templateUrl: injections.components.page.drinks.root.template,
                        }
                    },
                    resolve: {
                        logger: injections.services.loggerService,
                        drinksResource: (logger, homeResource) => {
                            logger.info("resolving drinks-resource...");
                            return homeResource.$get("drinks").then(res => {
                                logger.info("drinks-resource resolved...");
                                return res;
                            });
                        },

                        drinkResources: (logger, drinksResource) => {
                            logger.info("resolving drink-resources...");
                            if (!drinksResource.$has("items")) {
                                logger.info("no drink resources found. returning empty array...");
                                return [];
                            }
                            return drinksResource.$get("items")
                                .then(res => {
                                    logger.info("drink-resources resolved...");
                                    return res;
                                })
                                .catch(err => {
                                    logger.error("no collection in drinksResource");
                                    return null;
                                });
                        },
                    },
                })
                //this is the root state for the drinks
                .state(constants.STATES.drinks.overview, {
                    url: "",
                    abstract: true,
                    templateUrl: injections.components.page.drinks.overview.template,
                })
                //state for showing all drinks
                .state(constants.STATES.drinks.list, {
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
                //state for adding a new drink
                .state(constants.STATES.drinks.create, {
                    url: "/new",
                    views: {
                        "det@root.home.drinks.overview": {
                            templateUrl: injections.components.page.drinks.create.template,
                            controller: injections.components.page.drinks.create.controller,
                            controllerAs: "vm"
                        }
                    },
                })
                //state for showing single drink
                .state(constants.STATES.drinks.details, {
                    url: "/:id",
                    views: {
                        "det@root.home.drinks.overview": {
                            templateUrl: injections.components.page.drinks.details.template,
                            controller: injections.components.page.drinks.details.controller,
                            controllerAs: "vm"
                        }
                    },
                    resolve: {
                        drinkResource: (drinkResources:Array<any>,
                                        $stateParams:ng.ui.IStateParamsService,
                                        utilsService:services.UtilsService) => {
                            return utilsService.findInArray(drinkResources, item => item.id === $stateParams["id"]);
                        },
                    },
                })
                //state for updating a drink
                .state(constants.STATES.drinks.edit, {
                    url: "/edit",
                    views: {
                        "det@root.home.drinks.overview": {
                            templateUrl: injections.components.page.drinks.edit.template,
                            controller: injections.components.page.drinks.edit.controller,
                            controllerAs: "vm"
                        }
                    },
                })
                .state(constants.STATES.profile, {
                    url: "/profile",
                    views: {
                        "content@root": {
                            templateUrl: injections.components.page.profile.template,
                            controller: injections.components.page.profile.controller,
                            controllerAs: "vm"
                        }
                    },
                    resolve: {
                        logger: injections.services.loggerService,
                        profileResource: (logger, homeResource) => {
                            logger.info("resolving profile-resource...");
                            return homeResource.$get("profile").then(res => {
                                logger.info("profile-resource resolved...");
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
                        logger: injections.services.loggerService,
                        basketResource: (logger, homeResource) => {
                            logger.info("resolving basket-resource...");
                            return homeResource.$get("basket").then(res => {
                                logger.info("basket-resource resolved...");
                                return res;
                            });
                        },
                        basketResourceItems: (logger, basketResource) => {
                            return basketResource.$get("items").then(res => {
                                logger.info("basket-resource-items resolved...");
                                return res;
                            });
                        },
                    }
                })
                .state(constants.STATES.orders.root, {
                    url: "/orders",
                    abstract: true,
                    views: {
                        "content@root": {
                            templateUrl: injections.components.page.orders.root.template,
                        }
                    },
                    resolve: {
                        logger: injections.services.loggerService,
                        ordersResource: (logger, homeResource, $state) => {
                            logger.info("resolving orders-resource...");
                            return homeResource.$get("orders").then(res => {
                                logger.info("orders-resource resolved...");
                                return res;
                            });
                        },

                        orderResources: (logger, ordersResource) => {
                            logger.info("resolving order-items...");
                            if (!ordersResource.$has("items")) {
                                logger.info("no order items found. returning empty array...");
                                return [];
                            }
                            return ordersResource.$get("items")
                                .then(res => {
                                    logger.info("order-items resolved...");
                                    return res;
                                })
                                .catch(err => {
                                    logger.error("no collection in ordersResource");
                                    return null;
                                });
                        },
                    },
                })
                .state(constants.STATES.orders.list, {
                    url: "",
                    views: {
                        "@root.home.orders": {
                            templateUrl: injections.components.page.orders.list.template,
                            controller: injections.components.page.orders.list.controller,
                            controllerAs: "vm"
                        }
                    }
                })
                .state(constants.STATES.orders.details, {
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
                        orderResource: (orderResources:Array<any>,
                                        $stateParams:ng.ui.IStateParamsService,
                                        utilsService:services.UtilsService) => {
                            return utilsService.findInArray(orderResources, item => item.id === $stateParams["id"]);
                        },
                    },
                });
        }
    }
}

var mainApp = (function () {

    'use strict';

    angular.module('TBApp', [
        'ui.router', 'ngAnimate', 'ionic', 'TBApp.drinks', 'TBApp.dashboard', 'TBApp.customers','TBApp.orders',
        'DrinkAppDataServices', 'TBApp.profil', 'TBApp.basket', 'TBApp.menu', 'TBApp.appmenu', 'TBApp.login'
    ])

        .config(function($ionicConfigProvider, $stateProvider, $urlRouterProvider ) {
            $ionicConfigProvider.views.forwardCache(true);
            $ionicConfigProvider.views.maxCache(5);

            $stateProvider
                .state('appMenu', {
                    url: '',
                    abstract: true,
                    templateUrl: '/components/appmenu/appmenu.html',
                    controller: 'AppMenuController as appmenu'
                })
                .state('appMenu.dashboard',{
                    url: '/dashboard',
                    views: {
                        'pageContent': {
                            templateUrl: '/components/dashboard/dashboard.html',
                            controller: 'DashboardController as dashboard'
                        }
                    }
                })
                .state('appMenu.drinks', {
                    url: '/drinks',
                    cache: false,
                    views: {
                        'pageContent': {
                            templateUrl: '/components/drinks/drinks.html',
                            controller: 'DrinksController as drinks'
                        }
                    }
                })
                .state('appMenu.customers', {
                    url: '/customers',
                    views: {
                        'pageContent': {
                            templateUrl: '/components/customers/customers.html',
                            controller: 'CustomersController as customers'
                        }
                    }
                })
                .state('appMenu.customermenu', {
                    url: '/customers/:id',
                    abstract: true,
                    views: {
                        'pageContent': {
                            templateUrl: '/components/menu/menu.html',
                            controller: 'MenuController as menu'
                        }
                    }
                })
                .state('appMenu.customermenu.orders', {
                    url: '/orders',
                    views: {
                        'orders-tab': {
                            templateUrl: '/components/orders/orders.html',
                            controller: 'OrdersController as orders'
                        }
                    }
                })
                .state('appMenu.customermenu.profil', {
                    url: '/profil',
                    views: {
                        'profil-tab': {
                            templateUrl: '/components/profil/profil.html',
                            controller: 'ProfilController as profil'
                        }
                    }
                })
                .state('appMenu.customermenu.basket', {
                    url: '/basket',
                    views: {
                        'basket-tab': {
                            templateUrl: '/components/basket/basket.html',
                            controller: 'BasketController as basket'
                        }
                    }
                })
            ;

            $urlRouterProvider.otherwise('/dashboard');


        })

        .controller('TBAppController', ['$log','$ionicHistory', 'dataService', '$location',
            function ($log, $ionicHistory, dataService, $location) {
                $log.log("AppController");
                $log.log($location.path());

                var self = this;

                //dataService.init();

                self.title = "TB"

                self.goOneBack = function(){
                    $ionicHistory.goBack();
                };

            }]);

}());
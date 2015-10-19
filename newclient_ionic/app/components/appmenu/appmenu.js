var appMenuApp = (function () {

    'use strict';

    angular.module('TBApp.appmenu', ['ngAnimate', 'ionic', 'DrinkAppDataServices'])

        .controller('AppMenuController', ['$log', 'dataService', '$ionicSideMenuDelegate', '$scope',
            function ($log, dataService, $ionicSideMenuDelegate, $scope) {
                $log.log("AppMenuController");
                var self = this;

                self.list = dataService.menuSrv.getMenu();

                self.title = "TB";
                self.scope = $scope;


                self.toggleLeft = function () {
                    $ionicSideMenuDelegate.toggleLeft();
                };

                self.stateObj = dataService.headerSrv.getStateObj();

                self.state = dataService.headerSrv.getState();

                self.klickOn = function () {
                    dataService.loginSrv.loginOpen(self.scope);
                };

            }])

}());
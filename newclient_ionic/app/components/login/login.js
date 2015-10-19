var loginApp = (function () {

    'use strict';

    angular.module('TBApp.login', ['ngAnimate', 'ionic', 'DrinkAppDataServices', 'ui.router' ])

        .controller('LoginController', ['$log', 'dataService', '$state',
            function($log, dataService, $state ){
                $log.log("LoginController");

                var self = this;

                self.title = "Log on";

                self.user = {
                    name: "",
                    password: ""
                };

                self.loginClose = function(){
                    dataService.loginSrv.loginClose();
                };

                self.checkUser= function() {
                    dataService.loginSrv.authenticationUser(self.user.name, self.user.password, self.callbackLogin, dataService.menuSrv.getHomeUrl())
                };

                self.callbackLogin = function (response) {
                    if (response.status == 200) {
                        dataService.loginSrv.loginClose();

                        self.user = {
                            name: "",
                            password: ""
                        };

                        dataService.headerSrv.setStateLoggedOn();

                        dataService.menuSrv.setMenu(response);

                        //$state.go($state.current.name, {}, {location : true, reload : true });
                        $state.transitionTo($state.current, $state.$current.params, { reload: true, inherit: true, notify: true });

                    } else {
                        dataService.messageSrv.errorMessage("Log in failed", "Log in")
                    }
                }


            }]);

}());
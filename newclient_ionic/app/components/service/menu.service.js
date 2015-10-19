var DrinkAppMenuServices = angular.module('MenuServices', []);

DrinkAppMenuServices.service('menuService', ['$log', '$http',
    function ($log, $http) {
        $log.log("menu service");

        var self = this;

        self.menu = {};

        self.isInit = false;

        self.currentState = "";

        self.state = {
            dashboard: {name: "Dashboard", href: "appMenu.dashboard"},
            drinks: {name: "Drinks", href: "appMenu.drinks"},
            customers: {name: "Customers", href: "appMenu.customers"}
        };

        self.publishListWhenInit = [];

        self.init = function (serverUrl, msgSrv, loginSrv) {
            self.messageSrv = msgSrv;
            self.serverUrl = serverUrl;
            self.loginSrv = loginSrv;

            $http.get(self.serverUrl).then(function successCallback(response) {
                self.setMenu(response);
            }, function errorCallback(response) {
                self.messageSrv.errorMessage("read menu failed ", "Menu");
            });

        };

        self.subscribeMenuInit = function (callback) {
            if (self.isInit) {
                callback();
            } else {
                self.publishListWhenInit.push(callback);
            }
        };

        self.setMenu = function (inMenu) {
            self.menu.menuList = [];
            self.menuFull = inMenu.data._links;
            try {

                for (var item in self.menuFull) {
                    if (self.state[item]) {
                        self.menu.menuList.push({
                            name: self.state[item].name,
                            href: self.state[item].href
                        });
                    }

                }

            } catch (e) {
                $log.log(e);
            }

            try {
                if (self.menuFull.registerCustomer) {
                    self.register = self.menuFull.registerCustomer;
                }
            } catch (e) {
                $log.log(e);
            }
            try {
                if (self.menuFull.home) {
                    self.home = self.menuFull.home;
                }
            } catch (e) {

            }

            self.isInit = true;
            for (var i = 0; i < self.publishListWhenInit.length; i++) {
                self.publishListWhenInit[i]();
            }
            self.publishListWhenInit = [];

        };

        self.getMenu = function () {
            return self.menu;
        };

        self.getMenuUrl = function (menuId) {
            try {
                return self.menuFull[menuId].href;
            } catch (e) {
                //case hidden or not found
                if(self.loginSrv.isLoggedIn()){
                    self.messageSrv.errorMessage("resource not found", "")
                } else if (self.isInit) {
                    self.loginSrv.loginOpen();
                }
                $log.log(e);
            }
        };

        self.getHomeUrl = function () {
            return self.home.href;
        };

        self.getRegisterUrl = function () {
            return self.register.href;
        };

        self.setCurrentState = function(state){
            self.currentState = state;
        };

        self.getCurrentState = function(){
            return self.currentState;
        };

    }]);

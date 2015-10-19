var DrinkAppDataServices = angular.module('DrinkAppDataServices', [
    'HeaderServices', 'DrinksServices', 'MenuServices', 'RegServices', 'MessageServices', 'DashboardServices', 'LoginServices', 'CustomerServices'
]);

DrinkAppDataServices.service('dataService', ['$log', '$http', 'headerService', 'drinksService', 'menuService', 'registService','messageService', 'dashboardService', 'loginService', 'customerService',
    function ($log, $http, headerService, drinksService, menuService, registService, messageService, dashboardService, loginService, customerService) {
        $log.log("data service");

        var self = this;

        self.server = "http://localhost:3000";
        self.server_root = "/root";

        self.basket = [];
        self.drinks = [];
        self.orders = [];
        self.cusstomers = [];
        //self.links = [];
        //self.dashboard = [];

        self.headerSrv = headerService;
        self.drinkSrv = drinksService;
        self.menuSrv = menuService;
        self.registrationSrv = registService;
        self.messageSrv = messageService;
        self.dashboardSrv = dashboardService;
        self.loginSrv = loginService;
        self.customerSrv = customerService;

        //init
        self.menuSrv.init(self.server + self.server_root, self.messageSrv, self.loginSrv);

        self.getDetailItem = function (id) {
            for (var i = 0; i < self.drinks.length; i++) {
                if (self.drinks[i].id == id) {
                    return self.drinks[i];
                }
            }
        };

        self.getCustomer = function () {
            return self.customers;
        };

        self.getCustomerItem = function (id) {
            for (var i = 0; i < self.customers.length; i++) {
                if (self.customers[i].id == id) {
                    return self.customers[i];
                }
            }
        };



    }]);
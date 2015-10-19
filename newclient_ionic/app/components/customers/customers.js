var customersApp = (function () {

    'use strict';

    angular.module('TBApp.customers', ['ngAnimate', 'ionic', 'DrinkAppDataServices'])

        .controller('CustomersController', ['$log', 'dataService',
            function ($log, dataService) {
                $log.log("CustomersController");
                var self = this;

                self.init = function(){
                    dataService.customerSrv.readCustomerFromUrl(dataService.menuSrv.getMenuUrl("customers"));
                };

                dataService.menuSrv.subscribeMenuInit(self.init);

                self.list = dataService.customerSrv.getCustomerList();

            }]);

}());
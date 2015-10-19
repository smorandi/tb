
var orderApp = (function(){
    'use strict';

    angular.module('TBApp.orders', ['ngAnimate',  'ionic', 'DrinkAppDataServices'])

        .controller('OrdersController', ['$log', 'dataService', '$stateParams',
            function($log, dataService, $stateParams){
                $log.log("OrdersController")

                var self = this;

                self.list =  dataService.getOrders($stateParams.id);

            }]);

})();


var customersApp = (function () {

    'use strict';

    angular.module('TBApp.customerDetails', ['ngAnimate',  'ionic', 'DrinkAppDataServices'])

        .controller('CustomersDetailsController', ['$stateParams', 'dataService',
            function($stateParams, dataService ){
                var self = this;
                self.item = dataService.getCustomerItem($stateParams.id);
                self.firstname = self.item.firstname;
                self.lastname = self.item.lastname;
                self.login = self.item.loginname;

            }]);

}());
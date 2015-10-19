
var profilApp = (function () {

    'use strict';

    angular.module('TBApp.profil', ['ngAnimate',  'ionic'])

        .controller('ProfilController', ['$stateParams', 'dataService', '$log',
            function($stateParams, dataService, $log ){
                $log.log("ProfilController");

                var self = this;
                self.item = dataService.getCustomerItem($stateParams.id);
                self.firstname = self.item.firstname;
                self.lastname = self.item.lastname;
                self.login = self.item.loginname;

            }]);

}());

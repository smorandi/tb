var menuApp = (function () {

    'use strict';

    angular.module('TBApp.menu', ['ngAnimate',  'ionic'])

        .controller('MenuController', ['$log', '$stateParams', 'dataService',
            function($log, $stateParams, dataService){
                $log.log("MenuController");

                var self = this;

                self.customer = $stateParams.id;

            }]);

}());

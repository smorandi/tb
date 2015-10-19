
var basketApp = (function () {

    'use strict';

    angular.module('TBApp.basket', ['ngAnimate',  'ionic'])

        .controller('BasketController', ['$log', '$stateParams', 'dataService', '$scope',
            function($log, $stateParams, dataService, $scope){
                $log.log("BasketController");

                var self = this;

                self.list = dataService.getBasket($stateParams.id);


            }]);

}());

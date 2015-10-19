var drinksApp = (function () {

    'use strict';

    angular.module('TBApp.drinks', ['ngAnimate', 'ionic', 'DrinkAppDataServices'])

        .controller('DrinksController', ['$log','dataService',
            function ($log, dataService) {
                $log.log("DrinksController");

                var self = this;

                self.init = function(){
                    var url = dataService.menuSrv.getMenuUrl("drinks");
                    if(url){
                        dataService.drinkSrv.readDrinksFromUrl(url);
                    }
                };

                dataService.menuSrv.subscribeMenuInit(self.init);

                self.drinks = dataService.drinkSrv.getDrinksList();


            }]);

}());
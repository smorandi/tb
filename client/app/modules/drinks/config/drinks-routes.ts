///<reference path="../../../../typings/tsd.d.ts" />

module drinks {
    "use strict";

    angular.module("drinks").config(($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) => {
            function valToString(val) {
                return val !== null ? val.toString() : val;
            }

            $urlMatcherFactoryProvider.type('nonURIEncoded', {
                encode: valToString,
                decode: valToString,
                is: function () {
                    return true;
                }
            });


            //$urlRouterProvider.when(/drinks$/i, ($match, $state, $stateParams) => {
            //    if ($state.$current.navigable != $state || !equalForKeys($match, $stateParams)) {
            //        $state.transitionTo("drinks", {}, false);
            //    }
            //});

            $stateProvider.state("drinks", { // state for showing all drinks
                url: "/drinks",
                params: {
                    url: null, resource: null
                },
                templateUrl: "modules/drinks/views/drinks.html",
                controller: "DrinkListController",
                controllerAs: "vm",
            }).state("drinks.viewDrink", { //state for showing single drink
                url: "/{url:nonURIEncoded}",
                params: {
                    url: null, resource: null
                },
                templateUrl: "modules/drinks/views/drink-view.html",
                controller: "DrinkViewController",
                controllerAs: "vm",
            }).state("newDrink", { //state for adding a new drink
                url: "/{url:nonURIEncoded}/new",
                params: {
                    url: null, resource: null
                },
                templateUrl: "modules/drinks/views/drink-add.html",
                controller: "DrinkCreateController",
                controllerAs: "vm",
            }).state("editDrink", { //state for updating a drink
                url: "/{url:nonURIEncoded}/edit",
                params: {
                    url: null, resource: null
                },
                templateUrl: "modules/drinks/views/drink-edit.html",
                controller: "DrinkEditController",
                controllerAs: "vm",
            });
        }
    );
}
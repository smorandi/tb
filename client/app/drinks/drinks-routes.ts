///<reference path="../../typings/tsd.d.ts" />
///<reference path="../services/drinks-repository-service.ts" />

module drinks {
    "use strict";

    //angular.module("drinks").config(config);
    //
    //function config($stateProvider:ng.ui.IStateProvider) {
    //    $stateProvider
    //        .state("drinks", {
    //            url: "/drinks",
    //            templateUrl: "drinks/views/drinks.tpl.html",
    //            controller: "DrinksCtrl",
    //            controllerAs: "drinks",
    //            resolve: {
    //                "Something": ["DrinksRepository", (service:DrinksRepository.IDrinksRepository) => service.loadDrinks()]
    //            }
    //        })
    //        .state("drinks.detail", {
    //            url: "/:id",
    //            templateUrl: "drinks/views/drink-details.tpl.html",
    //            controller: "DrinkDetailsCtrl",
    //            controllerAs: "drinkDetails"
    //        });
    //}

    angular.module("drinks").config(($stateProvider:ng.ui.IStateProvider) => {
        $stateProvider.state("drinks", { // state for showing all drinks
            url: "/drinks",
            templateUrl: "drinks/views/drinks.html",
            controller: "DrinkListController",
            controllerAs: "vm",
        }).state("drinks.viewDrink", { //state for showing single drink
            url: "/:id",
            templateUrl: "drinks/views/drink-view.html",
            controller: "DrinkViewController",
            controllerAs: "vm",
        }).state("newDrink", { //state for adding a new drink
            url: "/drinks",
            templateUrl: "drinks/views/drink-add.html",
            controller: "DrinkCreateController",
            controllerAs: "vm",
        }).state("editDrink", { //state for updating a drink
            url: "/drinks/:id",
            templateUrl: "drinks/views/drink-edit.html",
            controller: "DrinkEditController",
            controllerAs: "vm",
        });
    });
}
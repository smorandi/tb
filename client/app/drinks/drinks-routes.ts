///<reference path="../../typings/tsd.d.ts" />

module drinks {
    "use strict";

    angular.module("drinks").config(($stateProvider:ng.ui.IStateProvider) => {
            $stateProvider.state("drinks", { // state for showing all drinks
                url: "/drinks",
                templateUrl: "drinks/views/drinks.html",
                controller: "DrinkListController",
                controllerAs: "vm",
            }).state("drinks.viewDrink", { //state for showing single drink
                    url: "/:link",
                    templateUrl: "drinks/views/drink-view.html",
                    //params: {
                    //    self: null, ngFriendlyUrl: function ($stateParams) {
                    //        var selfLink:string = $stateParams["self"];
                    //
                    //        if (selfLink === undefined || selfLink === null) {
                    //            return null;
                    //        }
                    //
                    //        return selfLink.substring(22);
                    //    }
                    //},
                    controller: "DrinkViewController",
                    controllerAs: "vm",
                }
            ).
                state("newDrink", { //state for adding a new drink
                    url: "/newDrink",
                    params: {
                        link: null
                    },
                    templateUrl: "drinks/views/drink-add.html",
                    controller: "DrinkCreateController",
                    controllerAs: "vm",
                }).state("editDrink", { //state for updating a drink
                    //url: "/drinks/:id",
                    templateUrl: "drinks/views/drink-edit.html",
                    controller: "DrinkEditController",
                    controllerAs: "vm",
                });
        }
    )
    ;
}
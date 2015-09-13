///<reference path="../../../../typings/tsd.d.ts" />
///<reference path="../../home/home-module.ts" />

module drinks {
    "use strict";

    class DrinkViewController {
        drink:any;

        public static $inject = ["$log", "$location", "$state", "utilsService", "drinkResource"];

        constructor(private $log:ng.ILogService, private $location:ng.ILocationService, private $state:ng.ui.IStateService, private utilsService:home.UtilsService, private drinkResource) {
            $log.info("DrinkViewController called with client-url: " + $location.path());
            this.drink = drinkResource;
        }

        public canDelete():void {
            return this.drink === undefined ? false : this.drink.$has("delete");
        }

        public canEdit():void {
            return this.drink === undefined ? false : this.drink.$has("update");
        }

        public deleteDrink(event:Event):void {
            if (this.utilsService.showPopup("Really delete this?")) {
                this.drink.$del("delete").then(res => this.$state.go("^.list"));
            }
            event.stopPropagation();
        }

        public editDrink() {
            this.$state.go(".editDrink");
        }
    }

    angular.module("drinks").controller("DrinkViewController", DrinkViewController);
}

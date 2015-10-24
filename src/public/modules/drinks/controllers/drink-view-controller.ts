///<reference path="../../../all.references.ts" />

module drinks {
    "use strict";

    class DrinkViewController {
        public drink:any;

        public static $inject = ["$log", "$location", "$state", "utilsService", "drinkResource"];

        constructor(private $log:ng.ILogService, private $location:ng.ILocationService, private $state:ng.ui.IStateService, private utilsService:services.UtilsService, private drinkResource) {
            $log.info("DrinkViewController called with client-url: " + $location.path());
            this.drink = drinkResource;
        }

        public canDelete():void {
            return this.drink ? this.drink.$has("delete") : false;
        }

        public canEdit():void {
            return this.drink ? this.drink.$has("update") : false;
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

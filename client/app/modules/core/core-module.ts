///<reference path="../../../typings/tsd.d.ts" />
module client {
    "use strict";

    angular.module("core", ["ui.router", "mgcrea.ngStrap", "drinks", "angular-hal"]).factory("WebsiteService", ["halClient", halClient => {
        return {
            "load": () => halClient.$get("http://localhost:3000")
        };
    }]).service("popupService", function ($window) {
        this.showPopup = function (message) {
            return $window.confirm(message);
        }

        this.alert = function (message) {
            return $window.alert(message);
        }
    });
}

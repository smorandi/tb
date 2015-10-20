///<reference path="../../../typings/tsd.d.ts" />

module home {
    "use strict";

    angular.module("home", ["ui.router", "mgcrea.ngStrap", "drinks", "dashboard", "admin", "angular-hal", "btford.socket-io"]
    );
}
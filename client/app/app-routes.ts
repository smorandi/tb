///<reference path="../typings/tsd.d.ts" />
module client {
    "use strict";

    angular.module("tb").config(config);

    function config($urlRouterProvider:ng.ui.IUrlRouterProvider) {
        $urlRouterProvider.otherwise("");
    }
}
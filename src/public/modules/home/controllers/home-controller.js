///<reference path="../../../../typings/tsd.d.ts" />
///<reference path="../home-module.ts" />
var home;
(function (home) {
    "use strict";
    var Page = (function () {
        function Page(name, state) {
            this.name = name;
            this.state = state;
        }
        return Page;
    })();
    var HomeController = (function () {
        function HomeController($log, $location, $scope, $state, socketService, homeResource) {
            this.$log = $log;
            this.$location = $location;
            this.$scope = $scope;
            this.$state = $state;
            this.socketService = socketService;
            this.homeResource = homeResource;
            $log.info("HomeController called with client-url: '" + $location.path() + "'");
        }
        HomeController.prototype.go = function (page) {
            this.$state.go(page.state);
        };
        HomeController.$inject = ["$log", "$location", "$scope", "$state", "socketService", "homeResource"];
        return HomeController;
    })();
    angular.module("home").controller("HomeController", HomeController);
})(home || (home = {}));
//# sourceMappingURL=home-controller.js.map
///<reference path="../../../typings/tsd.d.ts" />
var home;
(function (home) {
    "use strict";
    angular.module("home", ["ui.router", "mgcrea.ngStrap", "drinks", "dashboard", "engine", "angular-hal", "btford.socket-io"]).factory("apiService", function (halClient, $log) {
        return new ApiService(halClient, $log);
    }).factory("socketService", function (socketFactory) {
        // TODO: maybe get it from the index.html?!?
        var myIoSocket = io.connect("http://localhost:3000");
        var mySocket = socketFactory({
            ioSocket: myIoSocket
        });
        return mySocket;
    }).factory("utilsService", function ($window) {
        return new UtilsService($window);
    }).run(function ($log, $rootScope) {
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            $log.info("transition: " + fromState.name + " -> " + toState.name);
        });
    });
    var ApiService = (function () {
        function ApiService(halClient, $log) {
            this.halClient = halClient;
            this.$log = $log;
        }
        ApiService.prototype.$load = function () {
            // TODO: maybe get it from the index.html?!?
            return this.$get("http://localhost:3000/home");
        };
        ApiService.prototype.$get = function (loc) {
            this.$log.info("GET: " + loc);
            return this.halClient.$get(loc);
        };
        return ApiService;
    })();
    home.ApiService = ApiService;
    var UtilsService = (function () {
        function UtilsService($window) {
            this.$window = $window;
        }
        UtilsService.prototype.removeHostFromUrl = function (url) {
            return url.replace(/^[^#]*?:\/\/.*?(\/.*)$/, "$1");
        };
        UtilsService.prototype.showPopup = function (message) {
            return this.$window.confirm(message);
        };
        UtilsService.prototype.alert = function (message) {
            this.$window.alert(message);
        };
        UtilsService.prototype.findInArray = function (array, predicate) {
            for (var i = 0; i < array.length; i++) {
                var testee = array[i];
                if (predicate(testee)) {
                    return testee;
                }
            }
            return null;
        };
        return UtilsService;
    })();
    home.UtilsService = UtilsService;
})(home || (home = {}));
//# sourceMappingURL=home-module.js.map
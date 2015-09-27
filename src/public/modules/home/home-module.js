///<reference path="../../../typings/tsd.d.ts" />
var home;
(function (home) {
    "use strict";
    angular.module("home", ["ui.router", "mgcrea.ngStrap", "drinks", "dashboard", "admin", "angular-hal", "btford.socket-io"]).factory("apiService", function (halClient, $log) {
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
    }).factory("dashboard", function (apiService, socketService) {
        var db = [{ id: "xxx" }];
        apiService.$load().then(function (res) {
            res.$get("dashboard").then(function (x) {
                db.length = 0;
                x.forEach(function (item) { return db.push(item); });
            });
        });
        socketService.on("dashboard", function (data) {
            db.length = 0;
            data.forEach(function (item) { return db.push(item); });
        });
        return db;
    }).run(function ($log, $rootScope, utilsService) {
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            $log.info("transition: " + fromState.name + " -> " + toState.name);
        });
        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            $log.error("$stateChangeError: " + fromState.name + " -> " + toState.name);
            utilsService.alert(error);
        });
        $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
            $log.error("$stateNotFound: " + fromState.name + " -> " + unfoundState.to);
            utilsService.alert("$stateNotFound\n" + fromState.name + " -> " + unfoundState.to);
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
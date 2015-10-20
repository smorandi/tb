///<reference path="../../../typings/tsd.d.ts" />

module home {
    "use strict";

    angular.module("root", ["ui.router", "mgcrea.ngStrap", "home", "drinks", "dashboard", "admin", "angular-hal", "btford.socket-io"])
        .factory("apiService", (halClient, $log) => {
            return new ApiService(halClient, $log);
        })
        .factory("socketService", (socketFactory) => {

            // TODO: maybe get it from the index.html?!?
            var myIoSocket = io.connect("http://localhost:3000");

            var mySocket = socketFactory({
                ioSocket: myIoSocket
            });

            return mySocket;
        })
        .factory("utilsService", ($window) => {
            return new UtilsService($window);
        })
        .factory("dashboard", (apiService, socketService) => {
            var db = [{id: "xxx"}];

            apiService.$load().then(res => {
                res.$get("dashboard").then(x => {
                    db.length = 0;
                    x.forEach(item => db.push(item));
                });
            });

            socketService.on("dashboard", data => {
                db.length = 0;
                data.forEach(item => db.push(item));
            });

            return db;
        })
        .factory("authService", function ($window) {
            return {token: null};
        })
        .factory('myHttpInterceptor', function ($q,authService) {
            return {
                // optional method
                'request': function (config) {
                    // do something on success
                    var x = 5;
                    if (authService.token) {
                        config.headers.Authorization = 'Basic ' + authService.token;
                    }

                    return config;
                },

                // optional method
                'requestError': function (rejection) {
                    // do something on error
                    return $q.reject(rejection);
                },
                // optional method
                'response': function (response) {
                    // do something on success
                    return response;
                },
                'responseError': function (rejection) {
                    // do something on error
                    return $q.reject(rejection);
                }
            };
        })
        .config(['$httpProvider', function ($httpProvider) {
            $httpProvider.interceptors.push('myHttpInterceptor');
        }])
        .run(($log, $rootScope, utilsService, $window, authService, $injector) => {
            $rootScope.$on('$stateChangeStart',
                (event, toState, toParams, fromState, fromParams) => {
                    $log.info("transition: " + fromState.name + " -> " + toState.name);
                });
            $rootScope.$on('$stateChangeError',
                (event, toState, toParams, fromState, fromParams, error) => {
                    $log.error("$stateChangeError: " + fromState.name + " -> " + toState.name);

                    if (error.status === 401) {
                        utilsService.alert("NOT Authorized! calling with token now...");
                        authService.token = $window.btoa("customer:customer");
                        $injector.get("$state").go(toState, {}, {relative: fromState});
                    }
                    else {
                        utilsService.alert(error);
                    }
                });
            $rootScope.$on('$stateNotFound',
                (event, unfoundState, fromState, fromParams) => {
                    $log.error("$stateNotFound: " + fromState.name + " -> " + unfoundState.to);
                    utilsService.alert("$stateNotFound\n" + fromState.name + " -> " + unfoundState.to);
                });
        });


    export class ApiService {
        constructor(private halClient:any, private $log:ng.ILogService) {
        }

        public $load():ng.IPromise<any> {
            // TODO: maybe get it from the index.html?!?
            return this.$get("http://localhost:3000/root");
        }

        public $get(loc:string):ng.IPromise<any> {
            this.$log.info("GET: " + loc)
            return this.halClient.$get(loc);
        }
    }

    export class UtilsService {
        constructor(private $window:ng.IWindowService) {
        }

        public removeHostFromUrl(url:string):string {
            return url.replace(/^[^#]*?:\/\/.*?(\/.*)$/, "$1");
        }

        public showPopup(message:string):boolean {
            return this.$window.confirm(message);
        }

        public alert(message:string):void {
            this.$window.alert(message);
        }

        public findInArray<T>(array:Array<T>, predicate:(element:T) => boolean):T {
            for (var i = 0; i < array.length; i++) {
                var testee = array[i];
                if (predicate(testee)) {
                    return testee;
                }
            }
            return null;
        }
    }
}
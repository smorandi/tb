///<reference path="../../../typings/tsd.d.ts" />

module home {
    "use strict";

    angular.module("home", ["ui.router", "mgcrea.ngStrap", "drinks", "dashboard", "engine", "angular-hal", "btford.socket-io"]
    ).factory("apiService", (halClient, $log) => {
            return new ApiService(halClient, $log);
        }
    ).factory("socketService", (socketFactory) => {

            // TODO: maybe get it from the index.html?!?
            var myIoSocket = io.connect("http://localhost:3000");

            var mySocket = socketFactory({
                ioSocket: myIoSocket
            });

            return mySocket;
        }
    ).factory("utilsService", ($window) => {
            return new UtilsService($window);
        }
    ).run(($log, $rootScope) => {
            $rootScope.$on('$stateChangeStart',
                (event, toState, toParams, fromState, fromParams) => {
                    $log.info("transition: " + fromState.name + " -> " + toState.name);
                })
        });


    export class ApiService {
        constructor(private halClient:any, private $log:ng.ILogService) {
        }

        public $load():ng.IPromise<any> {
            // TODO: maybe get it from the index.html?!?
            return this.$get("http://localhost:3000/home");
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
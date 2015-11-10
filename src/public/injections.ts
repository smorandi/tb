"use strict"

module injections {

    export module directives {
        export var header:string = "header";
        export var flash:string = "flash";
        export var backImg:string = "backImg";
    }

    export module constants {
        export var appName:string = "tb";
    }

    export module controllers {
        export var dashboard:string = "dashboard-controller";
        export var profile:string = "profile-controller";
        export var system:string = "system-controller";
        export var register:string = "register-controller";
        export var loginDialog:string = "loginDialog-controller";
        export var basket:string = "basket-controller";

        export module drinks {
            export var list:string = "drink-list-controller";
            export var details:string = "drink-details-controller";
            export var create:string = "drink-create-controller";
            export var edit:string = "drink-edit-controller";
        }

        export module orders {
            export var list:string = "orders-list-controller";
            export var details:string = "order-details-controller";
        }
    }

    export module templates {
        export module register {
            export var template:string = "components/register/register.html"
        }
    }

    export module services {
        export var navigationService:string = "navigationService";
        export var menuService:string = "menuService";
        export var apiService:string = "apiService";
        export var authService:string = "authService";
        export var dashboardService:string = "dashboardService";
        export var socketService:string = "socketService";
        export var utilsService:string = "utilsService";
        export var httpInterceptorService:string = "httpInterceptorService";
        export var localStorageService:string = "localStorageService";
        export var loggerService:string = "loggerService";
        export var modalService:string = "modalService";
    }

    export module extServices {
        export var halService:string = "halClient";
        export var socketFactory:string = "socketFactory";
        export var toaster:string = "toaster";
        export var lodash:string = "_";
    }

    export module bootstrap {
        export var uibModal:string = "$uibModal";
        export var uibModalInst:string = "$uibModalInstance";
    }

    export module angular {
        export var $templateCache:string = "$templateCache";
        export var $interpolate:string = "$interpolate";
        export var $injector:string = "$injector";
        export var $log:string = "$log";
        export var $location:string = "$location";
        export var $scope:string = "$scope";
        export var $rootScope:string = "$rootScope";
        export var $filter:string = "$filter";
        export var $controller:string = "$controller";
        export var $httpService:string = "$http";
        export var $httpProvider:string = "$httpProvider";
        export var $qService:string = "$q";
        export var $timeoutService:string = "$timeout";
        export var $window:string = "$window";
        export var $SCEDelegateProvider:string = "$sceDelegateProvider";
        export var $translateProvider:string = "$translateProvider";
        export var translate = "pascalprecht.translate";
        export var $exceptionHandler = "$exceptionHandler";
        export var $filter = "$filter"
    }

    export module uiRouter {
        export var $stateProvider:string = "$stateProvider";
        export var $urlRouterProvider:string = "$urlRouterProvider";
        export var $stateService:string = "$state";
        export var $stateParams:string = "$stateParams";
    }

    export module rootScope {
        export var $stateChangeStart:string = "$stateChangeStart";
        export var $stateChangeSuccess:string = "$stateChangeSuccess";
        export var $stateChangeError:string = "$stateChangeError";
        export var $stateNotFound:string = "$stateNotFound";
    }
}
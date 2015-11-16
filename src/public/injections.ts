"use strict"

module injections {

    export module directives {
        export var header:string = "header";
        export var flash:string = "flash";
        export var backImg:string = "backImg";
        export var footer:string = "footer";
        export var pageHeader:string = "pageHeader";
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
        export var system:string = "components/pages/system/system.html"
        export var register:string = "components/pages/register/register.html"
        export var dashboard:string = "components/pages/dashboard/dashboard.html"
        export var profile:string = "components/pages/profile/profile.html"
        export var basket:string = "components/pages/basket/basket.html"
        export module orders {
            export var root:string = "components/pages/orders/orders-root.html"
            export var list:string = "components/pages/orders/list/orders-list.html"
            export var details:string = "components/pages/orders/details/order-details.html"
        }
        export module drinks {
            export var root:string = "components/pages/drinks/drinks-root.html"
            export var overview:string = "components/pages/drinks/drinks-overview.html"
            export var create:string = "components/pages/drinks/create/drink-create.html";
            export var edit:string = "components/pages/drinks/edit/drink-edit.html";
            export var list:string = "components/pages/drinks/list/drink-list.html";
            export var details:string = "components/pages/drinks/details/drink-details.html";
        }
        export module forms {
            export var user:string = "components/userform/user-form.html"
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
        export var footerService:string = "footerService";
        export var subHeaderService:string = "subHeaderService";
    }

    export module extServices {
        export var halService:string = "halClient";
        export var socketFactory:string = "socketFactory";
        export var toaster:string = "toaster";
        export var lodash:string = "_";
        export var valdrProvider:string = "valdrProvider";
        export var valdr:string = "valdr";
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
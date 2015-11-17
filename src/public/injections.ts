"use strict"

module injections {
    export module constants {
        export var appName:string = "tb";
    }

    export module directives {
        export var flash:string = "flash";
        export var backImg:string = "backImg";
    }

    export module components {
        export module root {
            export var template:string = "components/root/root.html";
        }
        export module login {
            export var controller:string = "loginDialog-controller";
            export var template:string = "components/login/login-dialog.html";
        }
        export module dbItem {
            export module tile {
                export var directive:string = "dbItemTile";
                export var controller:string = "db-item-tile-controller";
                export var template:string = "components/dbItem/tile/dbItem-tile.html";
            }
            export module flat {
                export var directive:string = "dbItemFlat";
                export var controller:string = "db-item-flat-controller";
                export var template:string = "components/dbItem/flat/dbItem-flat.html";
            }
        }
        export module header {
            export var directive:string = "header";
            export var template:string = "components/header/header.html";
        }
        export module footer {
            export var directive:string = "footer";
            export var template:string = "components/footer/footer.html";
        }
        export module pageHeader {
            export var directive:string = "pageHeader";
            export var template:string = "components/pageHeader/pageHeader.html";
        }
        export module page {
            export module dashboard {
                export var controller:string = "dashboard-controller";
                export var template:string = "components/pages/dashboard/dashboard.html";
            }
            export module system {
                export var controller:string = "system-controller";
                export var template:string = "components/pages/system/system.html";
            }
            export module register {
                export var controller:string = "register-controller";
                export var template:string = "components/pages/register/register.html";
            }
            export module profile {
                export var controller:string = "profile-controller";
                export var template:string = "components/pages/profile/profile.html";
            }
            export module basket {
                export var controller:string = "basket-controller";
                export var template:string = "components/pages/basket/basket.html";
            }
            export module orders {
                export module root {
                    export var template:string = "components/pages/orders/orders-root.html";
                }
                export module list {
                    export var controller:string = "orders-list-controller";
                    export var template:string = "components/pages/orders/list/orders-list.html";
                }
                export module details {
                    export var controller:string = "orders-details-controller";
                    export var template:string = "components/pages/orders/details/order-details.html";
                }
            }
            export module drinks {
                export module root {
                    export var template:string = "components/pages/drinks/drinks-root.html";
                }
                export module overview {
                    export var template:string = "components/pages/drinks/drinks-overview.html";
                }
                export module list {
                    export var controller:string = "drink-list-controller";
                    export var template:string = "components/pages/drinks/list/drink-list.html";
                }
                export module details {
                    export var controller:string = "drink-details-controller";
                    export var template:string = "components/pages/drinks/details/drink-details.html";
                }
                export module create {
                    export var controller:string = "drink-create-controller";
                    export var template:string = "components/pages/drinks/details/drink-details.html";
                }
                export module edit {
                    export var controller:string = "drink-edit-controller";
                    export var template:string = "components/pages/drinks/details/drink-details.html";
                }
            }
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
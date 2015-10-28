module injections {

    export module directives {
        export var header:string = "header";
    }

    //export module Constants{
    //    export var ApiHost: string = "ApiHost";
    //    export var AppName:string = "bringmehome";
    //    export var HostConstant:string = "host";
    //    export var $Angular:string = "$angular";
    //    export var $Navigator:string = "$navigator";
    //    export var $JQuery:string = "$jquery";
    //    export var $Enumerable:string = "$Enumerable";
    //    export var PedestrianRouteHost:string = "PedestrianRouteHost";
    //}
    //
    //export module Framework{
    //    export var EventFactory:string = "EventFactory";
    //}
    //
    //export module Filters{
    //    export var DurationFilter:string = "duration";
    //    export var FormatFilter:string = "format";
    //}

    //export module states {
    //    export var root:string = "root";
    //    export var register:string = "root.register";
    //    export var dashboard:string = "root.dashboard";
    //    export var home:string = "root.home";
    //    export var profile:string = "root.home.profile";
    //    export var drinks:string = "root.home.drinks.overview.list";
    //    export var basket:string = "root.home.basket";
    //    export var orders:string = "root.home.orders";
    //    export var system:string = "root.home.system";
    //}

    //export module links {
    //    export var root:string = "root";
    //    export var home:string = "home";
    //    export var register:string = "register";
    //    export var dashboard:string = "dashboard";
    //    export var profile:string = "profile";
    //    export var drinks:string = "drinks";
    //    export var basket:string = "basket";
    //    export var orders:string = "orders";
    //    export var system:string = "system";
    //}

    //export module Controllers{
    //    export var TravelDetailsController:string = "TravelDetailsController";
    //    export var DefaultController:string = "DefaultController";
    //    export var LocationController: string = "LocationController";
    //    export var LanguageController: string = "LanguageController";
    //    export var HomeController:string = "HomeController";
    //    export var ConnectionsController: string = "ConnectionsController";
    //    export var MapController: string = "MapController";
    //    export var LoadingController: string = "LoadingController";
    //    export var MenuController: string = "MenuController";
    //}

    export module services{
        export var linkService: string = "linkService";
        export var menuService: string = "menuService";
        export var apiService: string = "apiService";
        export var authService: string = "authService";
        export var dashboardService: string = "dashboardService";
        export var socketService: string = "socketService";
        export var utilsService: string = "utilsService";
    }

    //export module Ionic{
    //    export var $ionicLoading:string = "$ionicLoading";
    //    export var $ionicPopup:string = "$ionicPopup";
    //    export var $ionicHistory: string = "$ionicHistory";
    //    export var $ionicConfig: string = "$ionicConfig";
    //}

    export module angular {
        export var $templateCache:string = "$templateCache";
        export var $interpolate:string = "$interpolate";
        export var $injector:string = "$injector";
        export var $log:string = "$log";
        export var $Scope:string = "$scope";
        export var $RootScope:string = "$rootScope";
        export var $filter:string = "$filter";
        export var $controller:string = "$controller";
        export var $HttpService:string = "$http";
        export var $HttpProvider:string = "$httpProvider";
        export var $QService:string = "$q";
        export var $TimeoutService:string = "$timeout";
        export var $Window:string = "$window";
        export var $SCEDelegateProvider:string = "$sceDelegateProvider";
    }

    //export module Plugins {
    //    export var NetworkConnectionPlugin:string = "NetworkConnectionPlugin";
    //    export var GlobalizationPlugin:string = "GlobalizationPlugin";
    //    export var GeoLocationPlugin:string = "GeoLocationPlugin";
    //}

    export module uiRouter {
        export var $StateProvider:string = "$stateProvider";
        export var $UrlRouterProvider:string = "$urlRouterProvider";
        export var $StateService:string = "$state";
        export var $StateParams:string = "$stateParams";
    }
}
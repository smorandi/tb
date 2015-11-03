///<reference path="./all.references.ts" />

angular.module(injections.constants.appName, ["lodash", "ui.router", "ngAnimate", "toaster", "angular-hal", "btford.socket-io", "ui.bootstrap"])
    .service(injections.services.apiService, services.ApiService)
    .service(injections.services.socketService, services.SocketService)
    .service(injections.services.utilsService, services.UtilsService)
    .service(injections.services.dashboardService, services.DashboardService)
    .service(injections.services.authService, services.AuthService)
    .service(injections.services.navigationService, services.NavigationService)
    .service(injections.services.menuService, services.MenuService)
    .service(injections.services.httpInterceptorService, services.HttpInterceptorService)
    .service(injections.services.localStorage, services.LocalStorageService)
    .service(injections.services.loggerService, services.LoggerService)

    .directive(injections.directives.header, directives.Header)
    .directive(injections.directives.flash, directives.Flash)
    .directive(injections.directives.backImg, directives.BackImg)

    .controller(injections.controllers.dashboard, controllers.DashboardController)
    .controller(injections.controllers.profile, controllers.ProfileController)
    .controller(injections.controllers.system, controllers.SystemController)
    .controller(injections.controllers.register, controllers.RegisterController)
    .controller(injections.controllers.drinks.list, controllers.DrinkListController)
    .controller(injections.controllers.drinks.details, controllers.DrinkDetailsController)
    .controller(injections.controllers.drinks.create, controllers.DrinkCreateController)
    .controller(injections.controllers.drinks.edit, controllers.DrinkEditController)
    .controller(injections.controllers.authDialog, controllers.AuthDialogController)
    .controller(injections.controllers.basket, controllers.BasketController)
    .controller(injections.controllers.orders.list, controllers.OrdersListController)
    .controller(injections.controllers.orders.details, controllers.OrderDetailsController)

    .config(config.InterceptorConfig)
    .config(config.RoutesConfig)
    .run(run.Run);
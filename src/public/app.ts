///<reference path="./all.references.ts" />

angular.module(injections.constants.appName, ["ui.router", "mgcrea.ngStrap", "angular-hal", "btford.socket-io"])
    .service(injections.services.apiService, services.ApiService)
    .service(injections.services.socketService, services.SocketService)
    .service(injections.services.utilsService, services.UtilsService)
    .service(injections.services.dashboardService, services.DashboardService)
    .service(injections.services.authService, services.AuthService)
    .service(injections.services.navigationService, services.NavigationService)
    .service(injections.services.menuService, services.MenuService)
    .service(injections.services.httpInterceptorService, services.HttpInterceptorService)
    .directive(injections.directives.header, directives.Header)

    .controller(injections.controllers.dashboard, controllers.DashboardController)
    .controller(injections.controllers.profile, controllers.ProfileController)
    .controller(injections.controllers.system, controllers.SystemController)
    .controller(injections.controllers.drinks.list, controllers.DrinkListController)
    .controller(injections.controllers.drinks.details, controllers.DrinkDetailsController)
    .controller(injections.controllers.drinks.create, controllers.DrinkCreateController)
    .controller(injections.controllers.drinks.edit, controllers.DrinkEditController)

    .config(config.InterceptorConfig)
    .config(config.RoutesConfig)
    .run(run.Run);
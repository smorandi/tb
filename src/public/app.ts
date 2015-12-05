///<reference path="./all.references.ts" />

angular.module(injections.constants.appName, ["valdr", "lodash", "ui.router", "ngSanitize", "ngAnimate", "ngAria", "toaster", "angular-hal", "btford.socket-io", "ui.bootstrap", "pascalprecht.translate"])
    //======================================================================================
    //services (used application wide)
    //--------------------------------------------------------------------------------------
    .service(injections.services.apiService, services.ApiService)
    .service(injections.services.socketService, services.SocketService)
    .service(injections.services.utilsService, services.UtilsService)
    .service(injections.services.dashboardService, services.DashboardService)
    .service(injections.services.authService, services.AuthService)
    .service(injections.services.menuService, services.MenuService)
    .service(injections.services.httpInterceptorService, services.HttpInterceptorService)
    .service(injections.services.localStorageService, services.LocalStorageService)
    .service(injections.services.loggerService, services.LoggerService)
    .service(injections.services.modalService, services.ModalService)
    .service(injections.services.focusService, services.FocusService)

    //======================================================================================
    //directives (directives used within multiple components)
    //--------------------------------------------------------------------------------------
    .directive(injections.directives.flash, directives.Flash)
    .directive(injections.directives.backImg, directives.BackImg)
    .directive(injections.directives.stopEvent, directives.StopEvent)
    //.directive(injections.directives.formAutofillFix, directives.AutoFillFix)

    //======================================================================================
    //components (the visual bricks of the application)
    //--------------------------------------------------------------------------------------
    //header
    .directive(injections.components.header.directive, directives.Header)
    .controller(injections.components.header.controller, controllers.Header)

    //pageHeader
    .directive(injections.components.pageHeader.directive, directives.PageHeader)
    .controller(injections.components.pageHeader.controller, controllers.PageHeader)

    //dbItems
    //tile
    .directive(injections.components.dbItem.tile.directive, directives.DbItemTile)
    .controller(injections.components.dbItem.tile.controller, controllers.DbItemController)
    //flat
    .directive(injections.components.dbItem.flat.directive, directives.DbItemFlat)
    .controller(injections.components.dbItem.flat.controller, controllers.DbItemController)

    //search
    .directive(injections.components.search.directive, directives.Search)
    .controller(injections.components.search.controller, controllers.SearchController)

    //dashboard
    .controller(injections.components.page.dashboard.controller, controllers.DashboardController)

    //basket
    .controller(injections.components.page.basket.controller, controllers.BasketController)

    //system
    .controller(injections.components.page.system.controller, controllers.SystemController)

    //users
    .controller(injections.components.page.users.controller, controllers.UsersController)

    //orders
    .controller(injections.components.page.orders.list.controller, controllers.OrdersListController)
    .controller(injections.components.page.orders.details.controller, controllers.OrderDetailsController)

    //drinks
    .controller(injections.components.page.drinks.list.controller, controllers.DrinkListController)
    .controller(injections.components.page.drinks.details.controller, controllers.DrinkDetailsController)
    .controller(injections.components.page.drinks.create.controller, controllers.DrinkCreateController)
    .controller(injections.components.page.drinks.edit.controller, controllers.DrinkEditController)

    //profile
    .controller(injections.components.page.profile.controller, controllers.ProfileController)

    //register
    .controller(injections.components.page.register.controller, controllers.RegisterController)

    //login
    .controller(injections.components.login.controller, controllers.LoginDialogController)

    //forms
    .directive(injections.components.forms.user.directive, directives.UserForm)
    .controller(injections.components.forms.user.controller, controllers.UserForm)

    .directive(injections.components.forms.system.directive, directives.SystemForm)
    .controller(injections.components.forms.system.controller, controllers.SystemForm)

    .directive(injections.components.forms.drink.directive, directives.DrinkForm)
    .controller(injections.components.forms.drink.controller, controllers.DrinkForm)

    //======================================================================================
    //configs (application configuration, routes, i18n, validation, etc.)
    //--------------------------------------------------------------------------------------
    .config(config.InterceptorConfig)
    .config(config.I18nConfig)
    .config(config.RoutesConfig)
    .config(config.ValdrConfig)

    //======================================================================================
    //run (handling of errors, state changes and authentications)
    //--------------------------------------------------------------------------------------
    .run(run.Run);
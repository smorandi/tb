describe("Midway: Testing Routes", function() {

    var $state, $stateParams, $q, $templateCache, $location, $rootScope, $httpBackend, languageRequest;

    function mockTemplate(templateRoute, tmpl) {
        $templateCache.put(templateRoute, tmpl || templateRoute);
    }

    function goFrom(url) {
        return {
            toState: function (state, params) {
                $location.replace().url(url); //Don't actually trigger a reload
                $state.go(state, params);
                $rootScope.$digest();
            }
        };
    }

    beforeEach(module('tb'));
    beforeEach(inject(function ($injector) {

        $state = $injector.get('$state');
        $stateParams = $injector.get('$stateParams');
        $q = $injector.get('$q');
        $templateCache = $injector.get('$templateCache');
        $location = $injector.get('$location');
        $rootScope = $injector.get('$rootScope');
        $httpBackend = $injector.get('$httpBackend');

        languageRequest = $httpBackend.when('GET', './infrastructure/i18n/lang-en_US.json')
            .respond({
                "dialog.login.loginname": "Login Name",
                "dialog.login.password": "Password",
                "dialog.login.btn.login": "Login",
                "dialog.login.btn.cancel": "Cancel",

                "dialog.unregister.header": "Unregister {{value}}",
                "dialog.unregister.body": "Are you sure you want to unregister {{value}}?",
                "dialog.unregister.btn.cancel": "Cancel",
                "dialog.unregister.btn.unregister": "Unregister",



                "page.profile.header.title": "Profile",
                "page.profile.header.subtitle": "Displays your registration details",
                "page.profile.details.title": "User Details",
                "page.profile.properties.title": "User Properties",

                "page.register.header.title": "Sign Up",
                "page.register.header.subtitle": "Please register yourself to participate",

                "page.system.header.title": "System",
                "page.system.header.subtitle": "Control the system",
                "page.system.status.title": "Pricing Engine - Status",
                "page.system.properties.title": "System Properties",
                "page.system.events.title": "System Events",

                "page.basket.header.title": "Basket",
                "page.basket.header.subtitle": "Displays your basket items",

                "page.dashboard.header.title": "Dashboard",
                "page.dashboard.header.subtitle": "Browse through the available drinks",

                "page.orders.header.title": "Orders",
                "page.orders.header.subtitle": "Displays your order history",

                "page.drinks.header.title": "Drinks",
                "page.drinks.header.subtitle": "Displays all the available drinks",

                "page.users.header.title": "Users",
                "page.users.header.subtitle": "Displays all the users of the system",
                "page.users.list.title": "User List",
                "page.users.details.title": "Details for {{value}}",
                "page.users.properties.title": "User Properties for {{value}}",



                "engine.status.idle": "Idle",
                "engine.status.running": "Running",



                "link.name.root": "Root",
                "link.name.home": "Home",
                "link.name.register": "Sign Up",
                "link.name.dashboard": "Dashboard",
                "link.name.profile": "Profile",
                "link.name.drinks": "Drinks",
                "link.name.basket": "Basket",
                "link.name.orders": "Orders",
                "link.name.system": "System",
                "link.name.users": "Users",



                "action.login": "Login",
                "action.logout": "Logout",



                "NAME" : "Name",
                "QUANTITY" : "Quantity",
                "PRICE" : "Price",
                "PIECE" : "Piece",
                "TIME" : "Time",
                "STATE": "State",
                "DELETE" : "Delete",
                "TOTAL" : "Total",
                "CREATE_ORDER" : "Order",
                "LIST_DRINKS" : "List of drinks",
                "DETAILS_FOR" : "Details for",
                "NEW_DRINK" : "New drink",
                "BASKET" : "Basket",
                "ORDER": "My order"
            });

    }));

    describe('path', function () {
        function goTo(url) {
            $location.url(url);
            $rootScope.$digest();
        }

        describe('when empty', function () {
            beforeEach(function () {
                mockTemplate('./public/components/pages/dashboard/dashboard.html');
            });

            it('should go to the dshboard state', function () {
                goTo('');
                expect($state.current.name).toEqual('dashboard');
            });
        });

        describe('/', function () {
            beforeEach(function () {
                mockTemplate('./public/components/pages/dashboard/dashboard.html');
            });

            it('should go to the dashboard state', function () {
                goTo('/');
                expect($state.current.name).toEqual('dashboard');
            });
        });

        describe('/dashboard', function () {
            beforeEach(function () {
                mockTemplate('./public/components/pages/dashboard/dashboard.html');
            });

            it('should go to the dashboard state', function () {
                goTo('/');
                expect($state.current.name).toEqual('dashboard');
            });
        });

    });

});

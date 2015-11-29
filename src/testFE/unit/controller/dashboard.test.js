describe('dashboard controller: ', function () {

    beforeEach(module('tb'));

    beforeEach(angular.mock.module(function($provide) {
        $provide.service(injections.services.dashboardService, function mochService() {
                return dashboardServiceMoch;
            }
        );
    }));

    beforeEach(inject(function($injector) {
        $rootScope =  $injector.get('$rootScope');
        scope = $rootScope.$new();
        $controller = $injector.get('$controller');
        ctrl = $controller(injections.components.page.dashboard.controller, {$scope: scope});
    }));

    it('should have an initial controller', function(){
        expect(ctrl).not.to.equal(null);
    });

    it('dashboardService has 3 items, controller has the same', function(){
        expect(ctrl.dashboard).to.have.length(3);
    });
    describe('first item', function(){
        it('id', function(){
            expect(ctrl.dashboard[0].id).to.equal("drink0");
        });
        it('name', function(){
            expect(ctrl.dashboard[0].name).to.equal("Gin Tonic");
        });
        it('category', function(){
            expect(ctrl.dashboard[0].category).to.equal("cocktail");
        });
    });

    it('set filter', function(){
        ctrl.setFilter("test");
        expect(ctrl.currentFilter).to.equal("test");
    });

    it('set view', function(){
        ctrl.setView("test");
        expect(ctrl.currentView).to.equal("test");
    });

});
describe('profil Controller: ', function() {

    var $rootScope, $controller;
    var scope;
    var ctrl;

    beforeEach(module('tb'));

    beforeEach(angular.mock.module(function($provide) {
        $provide.service('profileResource', function mochService() {
                return profileResourceMoch;
            }
        );
    }));

    beforeEach(inject(function($injector) {
        $rootScope =  $injector.get('$rootScope');
        scope = $rootScope.$new();
        $controller = $injector.get('$controller');
        ctrl = $controller(injections.components.page.profile.controller, {$scope: scope});
    }));

    it('should have an initial controller', function(){
        expect(ctrl).not.to.equal(null);
    });

    it('firstname eq customer', function(){
        expect(ctrl.user.firstname).to.equal("customer");
    });

    it('first time the edit flag is false', function(){
        expect(ctrl.isEdit).to.equal(false);
    });

    it('edit profile, flag must be true', function(){
        ctrl.edit();
        expect(ctrl.isEdit).to.equal(true);
    })

});
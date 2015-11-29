var expect = require('chai').expect

describe('customer case', function() {

    before(function() {

    });

    after(function() {
        //logout
    });

    beforeEach(function() {
        browser.get('/');
    });

    describe('check dashboard', function(){
        it('has dashboard 10 tiles', function() {
            element.all(by.css('[ng-click="vm.flip()"]')).then(function(items) {
                //browser.debugger();
                expect(items).to.have.length(20);
                //expect(items[0].getText()).toBe('First');
            });
        });
    });

    //describe('login', function(){
    //    element(by.linkText('Login')).getOuterHtml().click();
    //});


});
var expect = require('chai').expect;

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
        it('has dashboard tiles', function() {
            element.all(by.css('db-item-tile')).then(function(items) {
                expect(items).not.to.be.null;
            });
        });
    });

    //describe('login', function(){
    //    element(by.linkText('Login')).getOuterHtml().click();
    //});
});
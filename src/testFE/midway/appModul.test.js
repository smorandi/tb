
describe("Midway: Testing Modules", function() {
    describe("TB Module:", function() {
        var app;
        before(function() {
            app = angular.module(injections.constants.appName);
        });

        it("should be registered", function() {
            expect(app).not.to.equal(null);
        });

        describe("Dependencies:", function() {

            var deps;
            var hasModule = function(m) {
                return deps.indexOf(m) >= 0;
            };
            before(function() {
                deps = app.value("appName").requires;
            });

            it("should have toaster as a dependency", function() {
                    expect(hasModule("toaster")).to.equal(true);
                }
            );

            it("should have ui.bootstrap as a dependency", function() {
                expect(hasModule('ui.bootstrap')).to.equal(true);
            });

            it("should have angular-hal as a dependency", function() {
                expect(hasModule('angular-hal')).to.equal(true);
            });

            it("should have ui.router as a dependency", function() {
               expect(hasModule('ui.router')).to.equal(true);
            });

        });
    });
});
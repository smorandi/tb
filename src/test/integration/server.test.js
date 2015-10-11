/**
 * Created by Stefano on 11.10.2015.
 */
var assert = require("assert");
var expect = require('expect.js');
var superagent = require("superagent");
var serverService = require("../../backend/services/server.service.js");
var status = require("http-status");
var config = require("../../backend/config");

describe("integration tests", function () {
    before(function (done) {
        serverService.startServer(true, function (err) {
            done(err);
        });
    });

    after(function (done) {
        serverService.stopServer(done);
    });

    it("server started, up & running", function (done) {
        var address = serverService.server.address();
        expect(address.port).to.be(config.server.port);
        done();
    });

    describe("root-tests", function () {
        it("can get root", function (done) {
            superagent.get("http://localhost:3000/root").end(function (err, res) {
                expect(err).not.to.be.ok();
                expect(res).to.be.ok();
                expect(res.status).to.be(status.OK);
                done();
            });
        });

        it("root contains expected links", function (done) {
            superagent.get("http://localhost:3000/root").end(function (err, res) {
                expect(err).not.to.be.ok();
                expect(res).to.be.ok();
                expect(res.status).to.be(status.OK);

                var rootResource = res.body;

                expect(rootResource).to.have.property("_links");
                expect(rootResource._links).to.have.property("dashboard");
                expect(rootResource._links).to.have.property("registerCustomer");
                expect(rootResource._links).to.have.property("home");

                done();
            });
        });
    });

    //describe("home-tests", function () {
    //    it("can get home", function (done) {
    //        superagent.get("http://localhost:3000/home").end(function (err, res) {
    //            expect(err).not.to.be.ok();
    //            expect(res).to.be.ok();
    //            expect(res.status).to.be(status.OK);
    //            done();
    //        });
    //    });
    //
    //    it("home contains expected links", function (done) {
    //        superagent.get("http://localhost:3000/home").end(function (err, res) {
    //            expect(err).not.to.be.ok();
    //            expect(res).to.be.ok();
    //            expect(res.status).to.be(status.OK);
    //
    //            var rootResource = res.body;
    //
    //            done();
    //        });
    //    });
    //});
});
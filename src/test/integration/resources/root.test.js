/**
 * Created by Stefano on 13.10.2015.
 */
"use strict";

var expect = require("expect.js");
var url = require("url");
var superagent = require("superagent");
var status = require("http-status");
var common = require("../../common");

describe("root-tests", function () {
    it("can get root", function (done) {
        superagent.get(common.rootUrl).end(function (err, res) {
            expect(err).not.to.be.ok();
            expect(res).to.be.ok();
            expect(res.status).to.be(status.OK);
            done();
        });
    });

    it("root contains expected links", function (done) {
        superagent.get(common.rootUrl).end(function (err, res) {
            expect(err).not.to.be.ok();
            expect(res).to.be.ok();
            expect(res.status).to.be(status.OK);

            var resource = res.body;

            expect(resource).to.have.property("_links");
            expect(resource._links).to.have.property("dashboard");
            expect(resource._links).to.have.property("registerCustomer");
            expect(resource._links).to.have.property("home");

            done();
        });
    });
});
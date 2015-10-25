/**
 * Created by Stefano on 13.10.2015.
 */
"use strict";

var expect = require("expect.js");
var url = require("url");
var status = require("http-status");
var common = require("../../common");

it("can get root", function (done) {
    common.traverson
        .from(common.urls.root)
        .addRequestOptions(common.headers.accept.hal)
        .getResource(function (err, res) {
            expect(err).not.to.be.ok();
            expect(res).to.be.ok();

            done();
        });
});

it("root resource has correct structure", function (done) {
    common.traverson
        .from(common.urls.root)
        .addRequestOptions(common.headers.accept.hal)
        .getResource(function (err, res) {
            expect(err).not.to.be.ok();
            expect(res).to.be.ok();

            expect(res).to.only.have.keys("_links");
            expect(res._links).to.only.have.keys("self", "dashboard", "registerCustomer", "home");

            done();
        });
});
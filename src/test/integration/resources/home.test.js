/**
 * Created by Stefano on 13.10.2015.
 */
"use strict";

var expect = require("expect.js");
var url = require("url");
var status = require("http-status");
var common = require("../../common");

it("unauth must not get home", function (done) {
    common.traverson
        .from(common.urls.root)
        .follow(common.paths.toHome)
        .addRequestOptions(common.headers.accept.hal)
        .getResource(function (err, res) {
            expect(err).to.be.ok();
            expect(res).not.to.be.ok();

            expect(err.httpStatus).to.be(status.UNAUTHORIZED);

            done();
        });
});

it("root has a correct home", function (done) {
    common.traverson
        .from(common.urls.root)
        .follow(common.paths.toHome)
        .addRequestOptions(common.headers.accept.hal)
        .addRequestOptions(common.headers.auth.defaults.root)
        .getResource(function (err, res) {
            expect(err).not.to.be.ok();
            expect(res).to.be.ok();

            expect(res).to.have.keys("_links");
            expect(res._links).to.only.have.keys("self", "dashboard", "root", "drinks", "profile", "system", "admins", "customers", "customerBaskets", "customerOrders", "users");

            done();
        });
});

it("admin has a correct home", function (done) {
    common.traverson
        .from(common.urls.root)
        .follow(common.paths.toHome)
        .addRequestOptions(common.headers.accept.hal)
        .addRequestOptions(common.headers.auth.defaults.admin)
        .getResource(function (err, res) {
            expect(err).not.to.be.ok();
            expect(res).to.be.ok();

            expect(res).to.have.keys("_links");
            expect(res._links).to.only.have.keys("self", "dashboard", "root", "drinks", "profile", "system", "admins", "customers", "customerBaskets", "customerOrders");

            done();
        });
});

it("customer has a correct home", function (done) {
    common.traverson
        .from(common.urls.root)
        .follow(common.paths.toHome)
        .addRequestOptions(common.headers.accept.hal)
        .addRequestOptions(common.headers.auth.defaults.customer)
        .getResource(function (err, res) {
            expect(err).not.to.be.ok();
            expect(res).to.be.ok();

            expect(res).to.have.keys("_links");
            expect(res._links).to.only.have.keys("self", "dashboard", "root", "profile", "basket", "orders");

            done();
        });
});
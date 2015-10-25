/**
 * Created by Stefano on 13.10.2015.
 */
"use strict";

var expect = require("expect.js");
var url = require("url");
var status = require("http-status");
var common = require("../../common");

it("unauth must not get baskets", function (done) {
    common.traverson
        .from(common.urls.root)
        .follow(common.paths.toCustomerBaskets)
        .addRequestOptions(common.headers.accept.hal)
        .getResource(function (err, res) {
            expect(err).to.be.ok();
            expect(res).not.to.be.ok();

            expect(err.httpStatus).to.be(status.UNAUTHORIZED);

            done();
        });
});

it("customer must not get baskets", function (done) {
    common.traverson
        .from(common.urls.baskets)
        .addRequestOptions(common.headers.accept.hal)
        .addRequestOptions(common.headers.auth.defaults.customer)
        .getResource(function (err, res) {
            expect(err).to.be.ok();
            expect(res).not.to.be.ok();

            expect(err.httpStatus).to.be(status.FORBIDDEN);

            done();
        });
});

it("admin can get baskets", function (done) {
    common.traverson
        .from(common.urls.root)
        .follow(common.paths.toCustomerBaskets)
        .addRequestOptions(common.headers.accept.hal)
        .addRequestOptions(common.headers.auth.defaults.admin)
        .getResource(function (err, res) {
            expect(err).not.to.be.ok();
            expect(res).to.be.ok();

            done();
        });
});

it("root can baskets", function (done) {
    common.traverson
        .from(common.urls.root)
        .follow(common.paths.toCustomerBaskets)
        .addRequestOptions(common.headers.accept.hal)
        .addRequestOptions(common.headers.auth.defaults.root)
        .getResource(function (err, res) {
            expect(err).not.to.be.ok();
            expect(res).to.be.ok();

            done();
        });
});

it("basket for customer has correct structure", function (done) {
    common.traverson
        .from(common.urls.root)
        .follow(common.paths.toBasket)
        .addRequestOptions(common.headers.accept.hal)
        .addRequestOptions(common.headers.auth.defaults.customer)
        .getResource(function (err, res) {
            expect(err).not.to.be.ok();
            expect(res).to.be.ok();

            expect(res).to.only.have.keys("_links", "_embedded");

            expect(res._links).to.only.have.keys("self", "create", "createOrder");
            expect(res._embedded).to.only.have.keys("items");

            done();
        });
});
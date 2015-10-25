/**
 * Created by Stefano on 13.10.2015.
 */
"use strict";

var expect = require("expect.js");
var url = require("url");
var status = require("http-status");
var common = require("../../common");

it("unauth must not get customers", function (done) {
    common.traverson
        .from(common.urls.root)
        .follow(common.paths.toCustomers)
        .addRequestOptions(common.headers.accept.hal)
        .getResource(function (err, res) {
            expect(err).to.be.ok();
            expect(res).not.to.be.ok();

            expect(err.httpStatus).to.be(status.UNAUTHORIZED);

            done();
        });
});

it("customer must not get customers", function (done) {
    common.traverson
        .from(common.urls.customers)
        .addRequestOptions(common.headers.accept.hal)
        .addRequestOptions(common.headers.auth.defaults.customer)
        .getResource(function (err, res) {
            expect(err).to.be.ok();
            expect(res).not.to.be.ok();

            expect(err.httpStatus).to.be(status.FORBIDDEN);

            done();
        });
});

it("admin can get customers", function (done) {
    common.traverson
        .from(common.urls.root)
        .follow(common.paths.toCustomers)
        .addRequestOptions(common.headers.accept.hal)
        .addRequestOptions(common.headers.auth.defaults.admin)
        .getResource(function (err, res) {
            expect(err).not.to.be.ok();
            expect(res).to.be.ok();

            done();
        });
});

it("root can get customers", function (done) {
    common.traverson
        .from(common.urls.root)
        .follow(common.paths.toCustomers)
        .addRequestOptions(common.headers.accept.hal)
        .addRequestOptions(common.headers.auth.defaults.root)
        .getResource(function (err, res) {
            expect(err).not.to.be.ok();
            expect(res).to.be.ok();

            done();
        });
});

it("customer has correct profile", function (done) {
    common.traverson
        .from(common.urls.root)
        .follow(common.paths.toProfile)
        .addRequestOptions(common.headers.accept.hal)
        .addRequestOptions(common.headers.auth.defaults.customer)
        .getResource(function (err, res) {
            expect(err).not.to.be.ok();
            expect(res).to.be.ok();

            expect(res).to.have.keys("_links", "id", "firstname", "lastname", "loginname", "password", "type");
            expect(res._links).to.only.have.keys("self", "delete", "update");

            expect(res.firstname).to.be("customer");
            expect(res.lastname).to.be("customer");
            expect(res.loginname).to.be("customer");
            expect(res.password).to.be("customer");
            expect(res.type).to.be("customer");

            done();
        });
});

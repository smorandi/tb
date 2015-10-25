/**
 * Created by Stefano on 13.10.2015.
 */
"use strict";

var expect = require("expect.js");
var url = require("url");
var status = require("http-status");
var common = require("../../common");

it("unauth must not get admins", function (done) {
    common.traverson
        .from(common.urls.root)
        .follow(common.paths.toAdmins)
        .addRequestOptions(common.headers.accept.hal)
        .getResource(function (err, res) {
            expect(err).to.be.ok();
            expect(res).not.to.be.ok();

            expect(err.httpStatus).to.be(status.UNAUTHORIZED);

            done();
        });
});

it("customer must not get admins", function (done) {
    common.traverson
        .from(common.urls.admins)
        .addRequestOptions(common.headers.accept.hal)
        .addRequestOptions(common.headers.auth.defaults.customer)
        .getResource(function (err, res) {
            expect(err).to.be.ok();
            expect(res).not.to.be.ok();

            expect(err.httpStatus).to.be(status.FORBIDDEN);

            done();
        });
});

it("admin can get admins", function (done) {
    common.traverson
        .from(common.urls.root)
        .follow(common.paths.toAdmins)
        .addRequestOptions(common.headers.accept.hal)
        .addRequestOptions(common.headers.auth.defaults.admin)
        .getResource(function (err, res) {
            expect(err).not.to.be.ok();
            expect(res).to.be.ok();

            done();
        });
});

it("root can get admins", function (done) {
    common.traverson
        .from(common.urls.root)
        .follow(common.paths.toAdmins)
        .addRequestOptions(common.headers.accept.hal)
        .addRequestOptions(common.headers.auth.defaults.root)
        .getResource(function (err, res) {
            expect(err).not.to.be.ok();
            expect(res).to.be.ok();

            done();
        });
});

it("admin has correct profile", function (done) {
    common.traverson
        .from(common.urls.root)
        .follow(common.paths.toProfile)
        .addRequestOptions(common.headers.accept.hal)
        .addRequestOptions(common.headers.auth.defaults.admin)
        .getResource(function (err, res) {
            expect(err).not.to.be.ok();
            expect(res).to.be.ok();

            expect(res).to.have.keys("_links", "id", "firstname", "lastname", "loginname", "password", "type");
            expect(res._links).to.only.have.keys("self", "delete", "update");

            expect(res.firstname).to.be("admin");
            expect(res.lastname).to.be("admin");
            expect(res.loginname).to.be("admin");
            expect(res.password).to.be("admin");
            expect(res.type).to.be("admin");

            done();
        });
});

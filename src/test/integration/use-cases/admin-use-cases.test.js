/**
 * Created by Stefano on 11.10.2015.
 */
var assert = require("assert");
var expect = require("expect.js");
var url = require("url");
var status = require("http-status");
var common = require("../../common");


var newAdmin = {
    firstname: "new_admin_firstname",
    lastname: "new_admin_lastname",
    loginname: "newAdmin",
    password: "newAdmin"
};

var newAdminErrorCase = {
    firstname: "new_admin_firstname",
    lastname: "new_admin_lastname",
    loginname: "admin",
    password: "admin"
};

it("admin's home loginname must be correct", function (done) {
    common.traverson
        .from(common.urls.root)
        .follow(common.paths.toHome)
        .addRequestOptions(common.headers.accept.hal)
        .addRequestOptions(common.headers.auth.defaults.admin)
        .getResource(function (err, res) {
            expect(err).not.to.be.ok();
            expect(res.loginname).to.be("admin");

            done();
        });
});

it("the admin list must contain only one admin", function (done) {
    common.traverson
        .from(common.urls.root)
        .follow(common.paths.toAdmins)
        .addRequestOptions(common.headers.accept.hal)
        .addRequestOptions(common.headers.auth.defaults.admin)
        .getResource(function (err, res) {
            expect(err).not.to.be.ok();
            expect(res).to.be.ok();

            expect(res._embedded.items).to.have.length(1);

            done();
        });
});

it("admin must not be able to create new admin with existing loginname", function (done) {
    common.traverson
        .from(common.urls.root)
        .follow(common.paths.toCreateAdmin)
        .addRequestOptions(common.headers.accept.hal)
        .addRequestOptions(common.headers.contentType.json)
        .addRequestOptions(common.headers.auth.defaults.admin)
        .post(newAdminErrorCase, function (err, res) {
            expect(err).not.to.be.ok();
            expect(res).to.be.ok();

            expect(res.statusCode).to.be(status.BAD_REQUEST);

            done();
        });
});

it("admin creates a new admin", function (done) {
    common.traverson
        .from(common.urls.root)
        .follow(common.paths.toCreateAdmin)
        .addRequestOptions(common.headers.accept.hal)
        .addRequestOptions(common.headers.contentType.json)
        .addRequestOptions(common.headers.auth.defaults.admin)
        .post(newAdmin, function (err, res) {
            expect(err).not.to.be.ok();
            expect(res).to.be.ok();

            expect(res.statusCode).to.be(status.ACCEPTED);

            done();
        });
});

it("admin must see the new admin", function (done) {
    common.traverson
        .from(common.urls.root)
        .follow(common.paths.toAdmins)
        .addRequestOptions(common.headers.accept.hal)
        .addRequestOptions(common.headers.auth.defaults.admin)
        .getResource(function (err, res) {
            expect(err).not.to.be.ok();
            expect(res).to.be.ok();

            expect(res._embedded.items).to.have.length(2);

            done();
        });
});

it("new admin has correct profile", function (done) {
    common.traverson
        .from(common.urls.root)
        .follow(common.paths.toProfile)
        .addRequestOptions(common.headers.accept.hal)
        .addRequestOptions(common.headers.auth.createHader(newAdmin.loginname, newAdmin.password))
        .getResource(function (err, res) {
            expect(err).not.to.be.ok();
            expect(res).to.be.ok();

            expect(res.firstname).to.be(newAdmin.firstname);
            expect(res.lastname).to.be(newAdmin.lastname);
            expect(res.loginname).to.be(newAdmin.loginname);
            expect(res.password).to.be(newAdmin.password);
            expect(res.type).to.be("admin");

            done();
        });
});
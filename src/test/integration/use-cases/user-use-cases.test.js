/**
 * Created by Stefano on 11.10.2015.
 */
var assert = require("assert");
var expect = require("expect.js");
var url = require("url");
var status = require("http-status");
var common = require("../../common");

var newCustomer = {
    firstname: "new_customer_firstname",
    lastname: "new_customer_lastname",
    loginname: "newCustomer",
    password: "newCustomer"
};

it("user registers as a new customer", function (done) {
    common.traverson
        .from(common.urls.root)
        .follow(common.paths.toRegisterCustomer)
        .addRequestOptions(common.headers.accept.hal)
        .addRequestOptions(common.headers.contentType.json)
        .post(newCustomer, function (err, res) {
            expect(err).not.to.be.ok();
            expect(res).to.be.ok();

            expect(res.statusCode).to.be(status.ACCEPTED);

            done();
        });
});

it("new customer's home loginname must be correct", function (done) {
    common.traverson
        .from(common.urls.root)
        .follow(common.paths.toHome)
        .addRequestOptions(common.headers.accept.hal)
        .addRequestOptions(common.headers.auth.createHader(newCustomer.loginname, newCustomer.password))
        .getResource(function (err, res) {
            expect(err).not.to.be.ok();
            expect(res.loginname).to.be(newCustomer.loginname);

            done();
        });
});

it("new customer cannot access customer's profile", function (done) {
    common.traverson
        .from(common.urls.customers + "/customer")
        .addRequestOptions(common.headers.accept.hal)
        .addRequestOptions(common.headers.auth.createHader(newCustomer.loginname, newCustomer.password))
        .getResource(function (err, res) {
            expect(err).to.be.ok();
            expect(res).not.to.be.ok();

            expect(err.httpStatus).to.be(status.FORBIDDEN);

            done();
        });
});

it("new customer deletes himself", function (done) {
    common.traverson
        .from(common.urls.root)
        .follow(common.paths.toProfile)
        .addRequestOptions(common.headers.accept.hal)
        .addRequestOptions(common.headers.auth.createHader(newCustomer.loginname, newCustomer.password))
        .delete(function (err, res) {
            expect(err).not.to.be.ok();
            expect(res).to.be.ok();

            expect(res.statusCode).to.be(status.NO_CONTENT);

            done();
        });
});

it("new customer cannot access home anymore", function (done) {
    common.traverson
        .from(common.urls.root)
        .follow(common.paths.toHome)
        .addRequestOptions(common.headers.accept.hal)
        .addRequestOptions(common.headers.auth.createHader(newCustomer.loginname, newCustomer.password))
        .getResource(function (err, res) {
            expect(err).to.be.ok();
            expect(res).not.to.be.ok();

            expect(err.httpStatus).to.be(status.UNAUTHORIZED);

            done();
        });
});
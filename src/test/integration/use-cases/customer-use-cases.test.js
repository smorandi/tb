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

it("customer's home loginname must be correct", function (done) {
    common.traverson
        .from(common.urls.root)
        .follow(common.paths.toHome)
        .addRequestOptions(common.headers.accept.hal)
        .addRequestOptions(common.headers.auth.defaults.customer)
        .getResource(function (err, res) {
            expect(err).not.to.be.ok();
            expect(res.loginname).to.be("customer");

            done();
        });
});

it("customer's home numberOfBasketItems must be '0'", function (done) {
    common.traverson
        .from(common.urls.root)
        .follow(common.paths.toHome)
        .addRequestOptions(common.headers.accept.hal)
        .addRequestOptions(common.headers.auth.defaults.customer)
        .getResource(function (err, res) {
            expect(err).not.to.be.ok();
            expect(res.numberOfBasketItems).to.be(0);

            done();
        });
});

it("customer's basket must be empty", function (done) {
    common.traverson
        .from(common.urls.root)
        .follow(common.paths.toBasket)
        .addRequestOptions(common.headers.accept.hal)
        .addRequestOptions(common.headers.auth.defaults.customer)
        .getResource(function (err, res) {
            expect(err).not.to.be.ok();
            expect(res._embedded.items).to.be.empty();

            done();
        });
});

it("customer adds two drinks of 'drink0' to his basket", function (done) {
    common.traverson
        .from(common.urls.root)
        .follow(common.paths.toCreateBasketItem)
        .addRequestOptions(common.headers.accept.hal)
        .addRequestOptions(common.headers.auth.defaults.customer)
        .addRequestOptions(common.headers.contentType.json)
        .post({drinkId: "drink0", number: 2}, function (err, res) {
            expect(err).not.to.be.ok();
            expect(res).to.be.ok();

            expect(res.statusCode).to.be(status.ACCEPTED);

            done();
        });
});

it("customer's home numberOfBasketItems must now be '1'", function (done) {
    common.traverson
        .from(common.urls.root)
        .follow(common.paths.toHome)
        .addRequestOptions(common.headers.accept.hal)
        .addRequestOptions(common.headers.auth.defaults.customer)
        .getResource(function (err, res) {
            expect(err).not.to.be.ok();
            expect(res.numberOfBasketItems).to.be(1);

            done();
        });
});

it("customer's basket must now contain two drinks of 'drink0'", function (done) {
    common.traverson
        .from(common.urls.root)
        .follow(common.paths.toBasket)
        .addRequestOptions(common.headers.accept.hal)
        .addRequestOptions(common.headers.auth.defaults.customer)
        .getResource(function (err, res) {
            expect(err).not.to.be.ok();
            expect(res).to.be.ok();

            expect(res._embedded.items).to.have.length(1);
            expect(res._embedded.items[0].number).to.be(2);
            expect(res._embedded.items[0].item.id).to.be("drink0");

            done();
        });
});

it("customer must have no orders", function (done) {
    common.traverson
        .from(common.urls.root)
        .follow(common.paths.toOrders)
        .addRequestOptions(common.headers.accept.hal)
        .addRequestOptions(common.headers.auth.defaults.customer)
        .getResource(function (err, res) {
            expect(err).not.to.be.ok();
            expect(res).to.be.ok();

            expect(res._embedded.items).to.be.empty();

            done();
        });
});

it("customer creates order", function (done) {
    common.traverson
        .from(common.urls.root)
        .follow(common.paths.toCreateOrder)
        .addRequestOptions(common.headers.accept.hal)
        .addRequestOptions(common.headers.auth.defaults.customer)
        .addRequestOptions(common.headers.contentType.json)
        .post({}, function (err, res) {
            expect(err).not.to.be.ok();
            expect(res).to.be.ok();

            expect(res.statusCode).to.be(status.ACCEPTED);

            // we give it a timeout to be on the save side for the next tests.
            // orders will change their state from pending to confirmed through the use of
            // a saga and therefore the next test might start too soon and fail otherwise..
            setTimeout(done, 2000);
        });
});

it("customer's orders must now have one order containing two drinks of 'drink0'", function (done) {
    common.traverson
        .from(common.urls.root)
        .follow(common.paths.toOrders)
        .addRequestOptions(common.headers.accept.hal)
        .addRequestOptions(common.headers.auth.defaults.customer)
        .getResource(function (err, res) {
            expect(err).not.to.be.ok();
            expect(res).to.be.ok();

            expect(res._embedded.items).to.have.length(1);
            expect(res._embedded.items[0].status).to.be("confirmed");
            expect(res._embedded.items[0].totalPrice).to.be(20);

            expect(res._embedded.items[0].orderItems).to.have.length(1);
            expect(res._embedded.items[0].orderItems[0].item.id).to.be("drink0");
            expect(res._embedded.items[0].orderItems[0].item.price).to.be(10);
            expect(res._embedded.items[0].orderItems[0].number).to.be(2);
            expect(res._embedded.items[0].orderItems[0].price).to.be(20);

            done();
        });
});

it("customer's basket must be empty", function (done) {
    common.traverson
        .from(common.urls.root)
        .follow(common.paths.toBasket)
        .addRequestOptions(common.headers.accept.hal)
        .addRequestOptions(common.headers.auth.defaults.customer)
        .getResource(function (err, res) {
            expect(err).not.to.be.ok();
            expect(res._embedded.items).to.be.empty();

            done();
        });
});


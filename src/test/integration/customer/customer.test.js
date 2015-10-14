/**
 * Created by Stefano on 11.10.2015.
 */
var assert = require("assert");
var expect = require("expect.js");
var url = require("url");
var superagent = require("superagent");
var status = require("http-status");
var common = require("../../common");

it("customer adds drink to basket (unauthenticated)", function (done) {
    superagent
        .post(common.basketsUrl + "/customer0")
        .send({drinkId: "drink0", number: 2})
        .end(function (err, res) {
            expect(err).to.be.ok();
            expect(err.status).to.be(status.UNAUTHORIZED);
            done();
        });
});

it("customer has no drink in basket", function (done) {
    superagent
        .get(common.basketsUrl + "/customer0")
        .set("Authorization", "Basic Y3VzdG9tZXI6Y3VzdG9tZXI=")
        .end(function (err, res) {
            expect(err).not.to.be.ok();
            expect(res).to.be.ok();
            expect(res.status).to.be(status.OK);

            var resource = res.body;
            expect(resource._embedded).to.have.property("items");
            expect(resource._embedded.items).to.be.empty();
            done();
        })
});

it("customer adds two drinks of drink0 to basket (authenticated)", function (done) {
    superagent
        .post(common.basketsUrl + "/customer0")
        .set("Authorization", "Basic Y3VzdG9tZXI6Y3VzdG9tZXI=")
        .send({drinkId: "drink0", number: 2})
        .end(function (err, res) {
            expect(err).not.to.be.ok();
            expect(res).to.be.ok();
            expect(res.status).to.be(status.ACCEPTED);
            done();
        });
});

it("customer has 2 drinks of drink0 in basket", function (done) {
    superagent
        .get(common.basketsUrl + "/customer0")
        .set("Authorization", "Basic Y3VzdG9tZXI6Y3VzdG9tZXI=")
        .end(function (err, res) {
            expect(err).not.to.be.ok();
            expect(res).to.be.ok();
            expect(res.status).to.be(status.OK);

            var resource = res.body;
            expect(resource._embedded).to.have.property("items");
            expect(resource._embedded.items).to.have.length(1);
            expect(resource._embedded.items[0].number).to.be(2);
            expect(resource._embedded.items[0].item.id).to.be("drink0");

            done();
        })
});
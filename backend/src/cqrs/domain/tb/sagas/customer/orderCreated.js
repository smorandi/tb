// we are not using sagas atm...

var pricingService = require("../../../../../core/services/pricing.service.js");
var logger = require("../../../../../config/logger");

var orderCreatedSaga = require("cqrs-saga").defineSaga({// event to match...
    name: "orderCreated",
    aggregate: "user",
    existing: false,
    containingProperties: ["aggregate.id"]
}, function (evt, saga, callback) {
    saga.set("userId", evt.aggregate.id);
    saga.set("orderId", evt.payload.id);

    pricingService.enrichOrderWithCurrentPrice(evt.payload, function (err, order) {
        if (err) {
            callback(err);
        }
        else {
            var cmd = {
                name: "confirmOrder",
                aggregate: {
                    name: "user",
                    id: evt.aggregate.id,
                    transactionId: saga.id
                },
                payload: order
            };

            saga.addCommandToSend(cmd);
            saga.commit(callback);
        }
    });
});


var orderConfirmedSaga = require("cqrs-saga").defineSaga({
    name: "orderConfirmed",
    aggregate: "user",
    containingProperties: ["aggregate.transactionId"],
    id: "aggregate.transactionId",
    existing: true
}, function (evt, saga, callback) {
    logger.debug("saga - orderConfirmed: destroyed");
    saga.destroy();
    saga.commit(callback);
});

module.exports = [orderCreatedSaga, orderConfirmedSaga];
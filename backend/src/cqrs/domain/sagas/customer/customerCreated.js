var customerCreated = require("cqrs-saga").defineSaga({// event to match...
    name: "customerCreated",
    aggregate: "customer",
    existing: false,
    containingProperties: ["aggregate.id"]
}, function (evt, saga, callback) {
    saga.set("customerId", evt.aggregate.id);

    var cmd = {
        name: "createBasket",
        aggregate: {
            name: "basket"
        },
        payload: {
            transactionId: saga.id,
        }
    };

    saga.addCommandToSend(cmd);

    saga.commit(callback);
});

var basketCreated = require("cqrs-saga").defineSaga({
    name: "basketCreated",
    aggregate: "basket",
    containingProperties: ["payload.transactionId"],
    id: "payload.transactionId",
    existing: true
}, function (evt, saga, callback) {

    saga.destroy();
    saga.commit(callback);
});

module.exports = [customerCreated, basketCreated];
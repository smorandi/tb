"use strict";

var profileResourceMoch = {
    "_links": {
        "self": {
            "href": "http://localhost:3000/customers/customer"
        },
        "delete": {
            "href": "http://localhost:3000/customers/customer"
        },
        "update": {
            "href": "http://localhost:3000/customers/customer"
        }
    },
    "_id": "customer",
    "id": "customer",
    "firstname": "customer",
    "lastname": "customer",
    "loginname": "customer",
    "password": "customer",
    "type": "customer",
    "creationDate": "2015-11-29T10:25:59.209Z",
    "modificationDate": null,
    "_destroyed": false,
    "_revision": 0,
    "basket": [],
    "orders": [],
    "commitStamp": 1448792759214,
    "_hash": "565ad2b77185f2800cc7904b"
};

var dashboardServiceMoch = {
    dashboard : [     {
        "_id": "drink0",
        "id": "drink0",
        "name": "Gin Tonic",
        "description": "Most favourite drink",
        "imageUrl": null,
        "category": "cocktail",
        "tags": [
            "alcoholic"
        ],
        "quantity": 3,
        "quantityUnit": "dl",
        "tick": {
            "price": 10,
            "delta": 0,
            "reason": "reset",
            "timestamp": "2015-11-29T10:25:59.293Z"
        },
        "price": 10,
        "lowestPrice": 10,
        "highestPrice": 10,
        "allTimeHigh": 10,
        "allTimeLow": 10,
        "commitStamp": 1448792759296,
        "_hash": "565ad2b77185f2800cc7907a"
    },
        {
            "_id": "drink1",
            "id": "drink1",
            "name": "Stärböcks",
            "description": "Fine jamaican blue mountain blend",
            "imageUrl": null,
            "category": "coffee",
            "tags": [
                "non-alcoholic"
            ],
            "quantity": 3,
            "quantityUnit": "dl",
            "tick": {
                "price": 4,
                "delta": 0,
                "reason": "reset",
                "timestamp": "2015-11-29T10:25:59.301Z"
            },
            "price": 4,
            "lowestPrice": 4,
            "highestPrice": 4,
            "allTimeHigh": 4,
            "allTimeLow": 4,
            "commitStamp": 1448792759302,
            "_hash": "565ad2b77185f2800cc7907e"
        },
        {
            "_id": "drink2",
            "id": "drink2",
            "name": "Duff Bräu",
            "description": "Ice cold and masterly brewed",
            "imageUrl": null,
            "category": "beer",
            "tags": [
                "alcoholic"
            ],
            "quantity": 5,
            "quantityUnit": "dl",
            "tick": {
                "price": 5,
                "delta": 0,
                "reason": "reset",
                "timestamp": "2015-11-29T10:25:59.305Z"
            },
            "price": 5,
            "lowestPrice": 5,
            "highestPrice": 5,
            "allTimeHigh": 5,
            "allTimeLow": 5,
            "commitStamp": 1448792759307,
            "_hash": "565ad2b77185f2800cc79082"
        }
    ]
};
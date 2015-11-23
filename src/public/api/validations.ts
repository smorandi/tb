/**
 * Created by Stefano on 15.11.2015.
 */

///<reference path="../all.references.ts" />

"use strict";

module validations {
    export var ValidationSchemas = {
        "User": {
            "firstname": {
                "required": {
                    "message": "First name is required."
                }
            },
            "lastname": {
                "required": {
                    "message": "Last name is required."
                }
            },
            "loginname": {
                "size": {
                    "min": 3,
                    "max": 20,
                    "message": "Login name must be between 3 and 20 characters."
                }
            },
            "password": {
                "size": {
                    "min": 3,
                    "max": 20,
                    "message": "Login name must be between 3 and 20 characters."
                }
            }
        },
        "System": {
            "priceReductionInterval": {
                "required": {
                    "message": "This value is required."
                },
                "min": {
                    "value": 1000,
                    "message": "Must be at least 1'000 ms."
                },
                "max": {
                    "value": 10000,
                    "message": "Must not exceed 10'000 ms."
                },
            },
            "priceReductionGracePeriod": {
                "required": {
                    "message": "This value is required."
                },
                "min": {
                    "value": 1000,
                    "message": "Must be at least 1'000 ms."
                },
                "max": {
                    "value": 10000,
                    "message": "Must not exceed 10'000 ms."
                },
            },
        },
        "Drink": {
            "name": {
                "required": {
                    "message": "This value is required."
                },
                "size": {
                    "min": 4,
                    "message": "The name must be over 4"
                }
            },
            "description": {
                "required": {
                    "message": "This value is required."
                }
            },
            "alcoholic": {},
            "quantity": {
                "required": {
                    "message": "This value is required."
                },
                "pattern": {
                    "value": "/^[0-9]+(\.[0-9]{1,2})?$/",
                    "message": "The value must be the pattern x.xx",
                }
            },
            "quantityUnit": {
                "required": {
                    "message": "This value is required."
                }
            },
            "basePrice": {
                "required": {
                    "message": "This value is required."
                },
                "pattern": {
                    "value": "/^[0-9]+(\.[0-9]{1,2})?$/",
                    "message": "The value must be the pattern x.xx",
                }
            },
            "minPrice": {
                "required": {
                    "message": "This value is required."
                },
                "pattern": {
                    "value": "/^[0-9]+(\.[0-9]{1,2})?$/",
                    "message": "The value must be the pattern x.xx",
                }
            },
            "maxPrice": {
                "required": {
                    "message": "This value is required."
                },
                "pattern": {
                    "value": "/^[0-9]+(\.[0-9]{1,2})?$/",
                    "message": "The value must be the pattern x.xx",
                }
            },
            "priceStep": {
                "required": {
                    "message": "This value is required."
                },
                "pattern": {
                    "value": "/^[0-9]+(\.[0-9]{1,2})?$/",
                    "message": "The value must be the pattern x.xx",
                }
            },
            "category":{
                "required": {
                    "message": "This value is required."
                },
            }
        }
    };
}
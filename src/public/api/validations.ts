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
        }
    };
}
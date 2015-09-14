/**
 * Created by Stefano on 23.08.2015.
 */
/// <reference path="../../../typings/tsd.d.ts" />
"use strict";

import express = require("express");
import engine = require("../../engine/engine");
import logger = require("../../config/logger");
import config = require("../../config/config");

var eventBus = require("../../emitter/emitter");
var hal = require("halberd");

class BaseController {
    constructor(public repository:any, public eventBus:any, public domainService:any, public cmdService:any) {
    }
}

export = BaseController;
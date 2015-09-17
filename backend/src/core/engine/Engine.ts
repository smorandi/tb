/**
 * Created by Stefano on 23.08.2015.
 */
/// <reference path="../../../typings/tsd.d.ts" />
"use strict";

import logger = require("../../config/logger");
import config = require("../../config/config");
import _ = require("lodash");

var drinksCollection = require("../../cqrs/viewmodels/drinks/collection");

class Engine {
    private status:string = "initial";
    private lastChangeDate:Date = new Date();
    private updateInterval:number = 5000;

    public getStatus():string {
        return this.status;
    }

    public getLastChangeDate():Date {
        return this.lastChangeDate;
    }

    public activate():void {
        logger.debug("engine activated...")

        this.status = "activated";
        this.lastChangeDate = new Date();
        timer = setInterval(() => this.loop(), this.updateInterval);
    }

    public deactivate():void {
        logger.debug("engine deactivated...")
        clearInterval(timer);

        this.status = "deactivated";
        this.lastChangeDate = new Date();
    }

    public initDashboard() {
        logger.debug("initializing dashboard...");
        drinksCollection.findViewModels({}, (err, docs) => {
            if (err) {
                logger.error("error in retrieving drinks", err);
            }
            else {
                dashboard.length = 0;
                docs.forEach((doc, index, drinks) => {
                    var drink = doc.toJSON();

                    var drinkId = drink.id;
                    var currentPrice = drink.basePrice;

                    var dashboardItem:any = {id: drinkId, currentPrice: currentPrice};
                    dashboard.push(dashboardItem);
                });
            }
        });
    }

    private recalculateDashboard():void {
        logger.debug("recalculating dashboard...");
        drinksCollection.findViewModels({}, (err, docs) => {
            if (err) {
                logger.error("error in retrieving drinks", err);
            }
            else{
                dashboard.length = 0;
                docs.forEach((doc, index, drinks) => {
                    var drink = doc.toJSON();

                    var drinkId = drink.id;
                    var currentPrice = Math.random() + drink.basePrice;

                    var dashboardItem:any = {id: drinkId, currentPrice: currentPrice};
                    dashboard.push(dashboardItem);
                });
            }
        });
    }

    public getDashboard():Array<any> {
        return dashboard;
    }

    private emitDashboard() {
        logger.debug("emitting dashboard...");
        wsIO.sockets.emit(config.websocketChannel_dashboard, dashboard);
    }

    private loop() {
        this.recalculateDashboard();
        this.emitDashboard();
    }
}

var wsIO:SocketIO.Server;
var timer:NodeJS.Timer;
export var engine = new Engine();
export var dashboard = [];

export function setWSIO(io:SocketIO.Server) {
    wsIO = io;
}

export function initDashboard() {
    engine.initDashboard();
}

export function activate():void {
    engine.activate();
}

export function deactivate():void {
    engine.deactivate();
}
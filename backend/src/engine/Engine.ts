/**
 * Created by Stefano on 23.08.2015.
 */
/// <reference path="../../typings/tsd.d.ts" />
"use strict";

import logger = require("../config/logger");
import _ = require("lodash");

class Engine {
    private status:string = "initial";
    private lastChangeDate:Date = new Date();
    private updateInterval:number = 5000;

    //constructor() {
    //}

    public getStatus():string {
        return this.status;
    }

    public getLastChangeDate():Date {
        return this.lastChangeDate;
    }

    public activate():void {
        logger.info("engine activated...")

        this.status = "activated";
        this.lastChangeDate = new Date();
        timer = setInterval(() => this.loop(), this.updateInterval);
    }

    public deactivate():void {
        logger.info("engine deactivated...")
        clearInterval(timer);

        this.status = "deactivated";
        this.lastChangeDate = new Date();
    }

    public initDashboard() {
        logger.info("initializing dashboard...");
        repository.find({}, (err, docs) => {
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
        logger.info("recalculating dashboard...");
        repository.find({}, (err, docs) => {
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
        logger.info("emitting dashboard...");
        wsIO.sockets.emit("dashboard", dashboard);
    }

    private loop() {
        this.recalculateDashboard();
        this.emitDashboard();
    }
}

var repository:any;
var wsIO:SocketIO.Server;
var timer:NodeJS.Timer;
export var engine = new Engine();
export var dashboard = [];

export function setWSIO(io:SocketIO.Server) {
    wsIO = io;
}

export function setRepository(repo:any) {
    repository = repo;
    initDashboard();
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
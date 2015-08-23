/**
 * Created by Stefano on 23.08.2015.
 */
/// <reference path="../../../typings/tsd.d.ts" />

import impl = require("../models/impl");
import logger = require("../../config/logger");

var wsIO:SocketIO.Server;
var timer:NodeJS.Timer;

export function setIO(io:SocketIO.Server):void {
    wsIO = io;
}

class Engine {
    private status:string = "initial";
    private lastChangeDate:Date = new Date();
    private updateInterval:number = 2000;

    public getStatus():string {
        return this.status;
    }

    public getLastChangeDate():Date {
        return this.lastChangeDate;
    }

    public activate():void {
        logger.info("engine activated...")
        timer = setInterval(() => this.loop(), this.updateInterval);

        this.status = "activated";
        this.lastChangeDate = new Date();
    }

    public deactivate():void {
        logger.info("engine deactivated...")
        clearInterval(timer);

        this.status = "deactivated";
        this.lastChangeDate = new Date();
    }

    private loop() {
        impl.drinkRepository.find({}).exec((err:Error, docs:Array<impl.IDrinkDocument>) => {
            logger.info("emitting new prices...");
            docs.forEach((doc, index, array) => {
                wsIO.sockets.emit("newPrices", doc);
            });
        });
    }
}

export var engine = new Engine();

var DrinkAppHeaderServices = angular.module('HeaderServices', []);

DrinkAppHeaderServices.service('headerService', ['$log', '$http',
    function ($log, $http) {
        $log.log("header service");

        var self = this;

        self.stateObj = {
            on: "loggedOn",
            off: "loggedOff"
        };

        self.menuObj = {
            title: "TB",
            state: "loggedOff"
        };

        self.getTitleReference = function () {
            return self.menuObj.title;
        };

        self.setTitle = function (titleString) {
            self.menuObj.title = titleString;
        };

        self.getState = function () {
            return self.menuObj.state;
        };

        self.setStateLoggedOff = function(){
          self.menuObj.state = self.stateObj.off;
        };

        self.setStateLoggedOn = function(){
            self.menuObj.state = self.stateObj.on;
        };

        //self.setState = function (pState) {
        //    if (pState == self.stateObj.on) {
        //        self.menuObj.state = self.stateObj.on;
        //    } else {
        //        self.menuObj.state = self.stateObj.off;
        //    }
        //};

        self.getStateObj = function () {
            return self.stateObj;
        };

    }]);

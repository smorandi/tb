var DrinkAppMessageServices = angular.module('MessageServices', ['toaster']);

DrinkAppDrinksServices.service('messageService', ['$log', '$http', 'toaster',
    function ($log, $http, toaster) {
        $log.log("message service");

        var self = this;

        self.successMessage = function(pText, pTitle) {
            var title;

            if(pTitle) {
                title = pTitle;
            } else {
                title = "success";
            }

            toaster.pop('succsess', title, pText);
        };

        self.errorMessage = function(pText, pTitle) {
            var title;

            if(pTitle) {
                title = pTitle;
            } else {
                title = "error";
            }

            toaster.pop('error', title, pText);
        };

        self.warningMessage = function(pText, pTitle) {
            var title;

            if(pTitle) {
                title = pTitle;
            } else {
                title = "warning";
            }

            toaster.pop('warning', title, pText);
        };

    }]);

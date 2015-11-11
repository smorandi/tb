///<reference path="../../all.references.ts" />

"use strict";

/**
 * This is a rip-off from some place i cannot remember anymore...
 */
module services {
    export class ModalService {

        private modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: "components/modal/modal.html"
        };

        private modalOptions = {
            closeButtonText: "Close",
            actionButtonText: "OK",
            glyph: null,
            headerText: "Proceed?",
            bodyText: "Perform this action?"
        };

        static $inject = [
            injections.services.loggerService,
            injections.bootstrap.uibModal,
        ];

        constructor(private logger:services.LoggerService, private uibModal:angular.ui.bootstrap.IModalService) {
        }

        public showModal(customModalDefaults, customModalOptions) {
            if (!customModalDefaults) customModalDefaults = {};
            customModalDefaults.backdrop = "static";
            return this.show(customModalDefaults, customModalOptions);
        }

        public show(customModalDefaults, customModalOptions) {
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults:any = {};
            var tempModalOptions:any = {};

            //Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(tempModalDefaults, this.modalDefaults, customModalDefaults);

            //Map modal.html $scope custom properties to defaults defined in service
            angular.extend(tempModalOptions, this.modalOptions, customModalOptions);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = ($scope, $modalInstance) => {
                    $scope.modalOptions = tempModalOptions;
                    $scope.modalOptions.ok = function (result) {
                        $modalInstance.close(result);
                    };
                    $scope.modalOptions.close = function (result) {
                        $modalInstance.dismiss("cancel");
                    };
                }
            }

            return this.uibModal.open(tempModalDefaults).result;
        }
    }
}
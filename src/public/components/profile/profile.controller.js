///<reference path="../../all.references.ts" />
"use strict";
var controllers;
(function (controllers) {
    var ProfileController = (function () {
        function ProfileController($log, $location, profileResource) {
            this.$log = $log;
            this.$location = $location;
            this.profileResource = profileResource;
            $log.info("ProfileController called with client-url: '" + $location.path() + "'");
        }
        ProfileController.$inject = [injections.angular.$log, injections.angular.$location, "profileResource"];
        return ProfileController;
    })();
    controllers.ProfileController = ProfileController;
})(controllers || (controllers = {}));
//# sourceMappingURL=profile.controller.js.map
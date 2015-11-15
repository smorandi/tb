///<reference path="../../all.references.ts" />

"use strict";

module config {
    export class ValdrConfig {
        static $inject = [
            injections.extServices.valdrProvider,
            "valdrMessageProvider"
        ];

        constructor(valdrProvider:any, valdrMessageProvider:any) {
            valdrProvider.addConstraints(validations.ValidationSchemas);
            //valdrMessageProvider.setTemplate('<div class="valdr-message">{{ violation.message }}</div>');
        }
    }
}

///<reference path="../../all.references.ts" />

"use strict";

module config {
    export class I18nConfig {
        static $inject = [
            injections.angular.$translateProvider
        ];

        constructor($translateProvider:angular.translate.ITranslateProvider) {
            $translateProvider.useStaticFilesLoader({
                prefix: './infrastructure/i18n/lang-',
                suffix: '.json'
            });

            $translateProvider.preferredLanguage('en_US');
        }
    }
}

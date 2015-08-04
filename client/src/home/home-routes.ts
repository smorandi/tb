///<reference path="../../typings/tsd.d.ts" />
module home {
  "use strict";

  angular
    .module("drinks")
    .config(config);

  function config($routeProvider:ng.route.IRouteProvider) {
    $routeProvider
      .when("/home", {
        templateUrl: "home/views/home.tpl.html",
        controller: "HomeCtrl",
        controllerAs: "home",
        resolve: {
          "Something": ["Repository", function (Repository:Home.Services.IRepository) {
            return Repository.loadPersonData();
          }]
        }
      })
      .when("/PersonDetail/:personId", {
        templateUrl: "home/views/person-detail.tpl.html",
        controller: "PersonDetailCtrl",
        controllerAs: "personDetail",
        resolve: {
          "Something": ["Repository", function (Repository:Home.Services.IRepository) {
            return Repository.loadPersonData();
          }]
        }
      });
  }
}

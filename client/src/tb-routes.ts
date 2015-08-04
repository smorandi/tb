///<reference path='../typings/tsd.d.ts' />
module myApp {
  'use strict';

  angular
    .module('myApp')
    .config(config);

  function config($routeProvider: ng.route.IRouteProvider) {
    $routeProvider.otherwise({
      redirectTo: '/home'
    });
  }
}

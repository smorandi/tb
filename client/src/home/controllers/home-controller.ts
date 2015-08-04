///<reference path='../../../typings/tsd.d.ts' />
module Home.Controllers {
  'use strict';

  class HomeCtrl {

    persons : Array<Home.Data.IPerson>;
    query: string;

    public static $inject = ['$log', '$location', '$http', 'Repository'];

    constructor(private $log : ng.ILogService, private $location : ng.ILocationService, private $http : ng.IHttpService, private repository : Home.Services.IRepository) {

      this.persons = this.repository.getPersons();

      this.$log.debug('home controller called');
    }

    showDetail(person : Home.Data.IPerson) {
      this.$log.debug('clicked on person id: ' + person.id);
      this.$location.path('/PersonDetail/' + person.id);
    }

  }


  /**
  * @ngdoc object
  * @name home.controller:HomeCtrl
  *
  * @description
  *
  */
  angular
    .module('home')
    .controller('HomeCtrl', HomeCtrl);
}

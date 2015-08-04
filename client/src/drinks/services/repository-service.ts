///<reference path='../../../typings/tsd.d.ts' />
module Home.Services {
    'use strict';

    export interface IRepository {
        loadPersonData() : ng.IPromise<Home.Data.IPerson>;
        getPersons():Array<Home.Data.IPerson>;
        getPerson(id : number):Home.Data.IPerson;
    }

    class Repository {
        personData : Array<Home.Data.IPerson>;

        public static $inject = ['$http', '$q'];

        constructor(private $http:ng.IHttpService, private $q : ng.IQService) {
        }

        loadPersonData() : ng.IPromise<Home.Data.IPerson> {
            var deferred = this.$q.defer();

            if (!this.personData) {
                this.$http.get('/data/data.json').then((data) => {
                    this.personData = <Array<Home.Data.IPerson>> data.data;
                    deferred.resolve(this.personData);
                });
            } else {
                deferred.resolve(this.personData);
            }
            return deferred.promise;
        }

        getPersons():Array<Home.Data.IPerson> {
            return this.personData;
        }

        getPerson(id : number):Home.Data.IPerson {
            return this.personData[id - 1];
        }
    }

    angular
        .module('home')
        .service('Repository', Repository);
}

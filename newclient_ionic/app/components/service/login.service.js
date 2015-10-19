var DrinkAppLoginServices = angular.module('LoginServices', ['ionic']);

DrinkAppLoginServices.service('loginService', ['$log', '$http', '$ionicModal',
    function ($log, $http, $ionicModal) {
        $log.log("login service");

        var self = this;

        self.auth = null;

        self.ionicModal = $ionicModal;

        self.loginOpen = function (pScope) {
            self.scopeModal = pScope;
            if (self.modal) {
                self.modal.show();
            } else {
                $ionicModal.fromTemplateUrl('../components/login/login.html', {
                    scope: pScope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    self.modal = modal;

                    if(self.scopeModal) {
                        self.scopeModal.$on('$destroy', function() {
                            $log.log("modal destroy");
                            self.modal.remove();
                            delete self.modal;
                        });

                        self.scopeModal.$on('modal.hidden', function() {
                            $log.log("modal hidden");
                        });

                        self.scopeModal.$on('modal.removed', function() {
                            $log.log("modal removed");
                        });
                    }

                    self.modal.show();

                });
            }
        };

        self.loginClose = function () {
            if(self.modal){
                self.modal.hide();
            }
        };

        self.authenticationUser = function (username, password, callback, url) {
            self.auth = window.btoa(username + ':' + password);
            $http.defaults.headers.common['Authorization'] = 'Basic ' + self.auth;
            $http.get(url, {"username": username, "password": password}).then(
                function successCallback(response) {
                    callback(response);
                },
                function errorCallback(response) {
                    delete self.auth;
                    $http.defaults.headers.common.Authorization = 'Basic ';
                    callback(response);
                });
        };

        self.isLoggedIn = function(){
            var back = false;
            if (self.auth) {
                back = true;
            }

            return back;
        };

        //$cookieStore.put('globals', $rootScope.globals);
        // $cookieStore.remove('globals');
        //$http.defaults.headers.common.Authorization = 'Basic ';


    }]);

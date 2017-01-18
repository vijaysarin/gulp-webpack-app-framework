'use strict';

require('./login.html');

var loginRouteModule = angular.module('login.route', []);

loginRouteModule.run(appRun);

// @ngInject
function appRun(routehelper) {
    routehelper.configureRoutes(getRoutes());
}

function getRoutes() {
    return [
        {
            state: 'login',
            config: {
                url: '/login',
                templateUrl: 'login/login.html',
                controller: 'login',
                controllerAs: 'vm',
                title: 'Login',
                settings: {
                    nav: 0
                },
                ncyBreadcrumb: {
                    label: 'Login',
                    parent: 'Home'
                },
                resolve: {
                    foo: [
                        '$q', '$ocLazyLoad',
                        function ($q, $ocLazyLoad) {
                            var deferred = $q.defer();
                            require.ensure([], function () {
                                var module = require('./login.module');
                                $ocLazyLoad.load({
                                    name: 'app.login'
                                });
                                deferred.resolve(module);
                            });
                            return deferred.promise;
                        }
                    ]
                }
            }
        }
    ];
}

module.exports = loginRouteModule;

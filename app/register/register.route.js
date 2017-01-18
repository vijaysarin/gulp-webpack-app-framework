'use strict';

require('./register.html');

var registerRouteModule = angular.module('register.route', []);

registerRouteModule.run(appRun);

// @ngInject
function appRun(routehelper) {
    routehelper.configureRoutes(getRoutes());
}

function getRoutes() {
    return [
        {
            state: 'register',
            config: {
                url: '/register',
                templateUrl: 'register/register.html',
                controller: 'register',
                controllerAs: 'vm',
                title: 'Register',
                settings: {
                    nav: 0
                },
                ncyBreadcrumb: {
                    label: 'Register',
                    parent: 'Home'
                },
                resolve: {
                    foo: [
                        '$q', '$ocLazyLoad',
                        function ($q, $ocLazyLoad) {
                            var deferred = $q.defer();
                            require.ensure([], function () {
                                var module = require('./register.module');
                                $ocLazyLoad.load({
                                    name: 'app.register'
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

module.exports = registerRouteModule;

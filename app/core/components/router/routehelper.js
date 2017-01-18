'use strict';

module.exports = function () {

    angular
        .module('core.router')
        .provider('routehelperConfig', routehelperConfig)
        .factory('routehelper', routehelper);



    // Must configure via the routehelperConfigProvider
    function routehelperConfig() {
        /* jshint validthis:true */
        this.config = {
            // These are the properties we need to set
            // $routeProvider: undefined
            // docTitle: ''
            // resolveAlways: {ready: function(){ } }
        };

        this.$get = function () {
            return {
                config: this.config
            };
        };
    }

    // @ngInject
    function routehelper($rootScope, $state, logger, routehelperConfig) {
        var handlingRouteChangeError = false;
        var routeCounts = {
            errors: 0,
            changes: 0
        };
        var $stateProvider = routehelperConfig.config.$stateProvider;
        var $urlRouterProvider = routehelperConfig.config.$urlRouterProvider;
        var defaultRoute = routehelperConfig.config.defaultRoute;
        var resolveAlways = routehelperConfig.config.resolveAlways || {};

        var service = {
            configureRoutes: configureRoutes,
            getRoutes: getRoutes,
            routeCounts: routeCounts
        };

        init();

        return service;

        function configureRoutes(routes) {
            routes.forEach(function (route) {
                route.config.resolve = angular.extend(route.config.resolve || {}, resolveAlways);
                $stateProvider.state(route.state, route.config);
            });
            if (defaultRoute) {
                $urlRouterProvider.otherwise(defaultRoute);
            }
        }

        function handleRoutingErrors() {
            // Route cancellation:
            // On routing error, go to the dashboard.
            // Provide an exit clause if it tries to do it twice.
            $rootScope.$on('$stateChangeError',
                function (event, current, previous, rejection) {
                    event.preventDefault();
                    if (handlingRouteChangeError) {
                        return;
                    }
                    routeCounts.errors++;
                    handlingRouteChangeError = true;
                    var destination = (current && (current.title || current.name || current.loadedTemplateUrl)) ||
                        'unknown target';
                    var msg = 'Error routing to ' + destination + '. ' + (rejection.msg || '');
                    logger.warning(msg, [current]);
                    //$location.path('/');
                }
            );
        }

        function init() {
            handleRoutingErrors();
            updateDocTitle();
        }

        function getRoutes() {
            return $state.get();
        }

        function updateDocTitle() {
            $rootScope.$on('$stateChangeSuccess',
                function (event, current, previous) {
                    routeCounts.changes++;
                    handlingRouteChangeError = false;
                    var title = routehelperConfig.config.docTitle + ' ' + (current.title || '');
                    $rootScope.title = title; // data bind to <title>
                }
            );
        }
    }
};

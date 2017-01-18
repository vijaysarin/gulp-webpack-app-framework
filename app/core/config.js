'use strict';

module.exports = function () {

    var core = angular.module('app.core');

    var config = {
        appTitle: 'NG Webpack Gulp Demo - ',
        appErrorPrefix: '[NG Webpack Gulp - App Error - ]',
        version: '1.1.0',
        debug: true,
        dateFormat: '',
        dateTimeFormat: '',
        langCode: 'en-US',
        countryCode: '',
        cacheCapacity: 10,
        locale: 'en-US',
        fallbackLocale: 'en-US'
    };

    core.value('config', config);

    core.config(configure);

    /* @ngInject */
    function configure($logProvider, exceptionHandlerProvider, routehelperConfigProvider, $stateProvider, $urlRouterProvider, $httpProvider) {
        // turn debugging off/on (no info or warn)
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(config.debug);
        }

        // Configure the common exception handler
        exceptionHandlerProvider.configure(config.appErrorPrefix);

        // Router Config
        routehelperConfigProvider.config.$stateProvider = $stateProvider;
        routehelperConfigProvider.config.$urlRouterProvider = $urlRouterProvider;
        routehelperConfigProvider.config.defaultRoute = '/layout';
        routehelperConfigProvider.config.docTitle = config.appTitle;

        // http provider config
        $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
    }

};

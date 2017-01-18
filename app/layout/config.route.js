'use strict';

module.exports = function () {

    require('./layout.html');

    var layout = angular.module('app.layout');

    layout.run(appRun);

    // @ngInject
    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                state: 'layout',
                config: {
                    url: '/layout',
                    templateUrl: 'layout/layout.html',
                    controller: 'layout',
                    controllerAs: 'vm',
                    title: 'Home',
                    settings: {
                        nav: 0
                    },
                    ncyBreadcrumb: {
                        label: 'Home'
                    }
                }
            }
        ];
    }

};

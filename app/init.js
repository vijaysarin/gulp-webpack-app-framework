'use strict';

var myApp = require('./app.module');

angular.element(document).ready(function () {
    angular.bootstrap(document, [myApp.name], {
        strictDi: true
    });
});

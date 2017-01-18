'use strict';

module.exports = angular.module('app.login', [
    require('./login.route').name
]);

require('./login.controller')();
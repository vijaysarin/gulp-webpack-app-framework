'use strict';

module.exports = angular.module('app.register', [
    require('./register.route').name
]);

require('./register.controller')();

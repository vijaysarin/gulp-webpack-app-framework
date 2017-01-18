'use strict';


module.exports = angular.module('app', [
    require('./core/core.module').name,
    require('./layout/layout.module').name,
    require('./login/login.route').name,
    require('./register/register.route').name
]);

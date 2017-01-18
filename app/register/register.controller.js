'use strict';

module.exports = function () {

    angular
        .module('app.register')
        .controller('register', login);

    // @ngInject
    function login(utils, logger, $q, $timeout, exception, CONST, user, $rootScope) {

        /*jshint validthis: true */

        var vm = this;
        vm.message = "Success";
    }

};

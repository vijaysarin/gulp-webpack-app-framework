'use strict';

module.exports = function () {

    angular
        .module('app.layout')
        .controller('layout', layout);

    // @ngInject
    function layout(utils, logger, $q, $timeout, exception, CONST, user, $rootScope) {

        /*jshint validthis: true */
        var vm = this;
        vm.message = "This is the home page";        
    }

};

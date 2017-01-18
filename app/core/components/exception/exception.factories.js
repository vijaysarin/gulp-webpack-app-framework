'use strict';

module.exports = function () {

    angular.module('core.exception')
        .factory('exception', exception);


    function exception(logger) {

        function catcher(message) {
            return function (reason) {
                logger.error(message, reason);
            };
        }

        var service = {
            catcher: catcher
        }

        return service;
    }

};

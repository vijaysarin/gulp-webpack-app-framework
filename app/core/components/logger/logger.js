'use strict';

module.exports = function () {

    angular.module('core.logger')
        .factory('logger', logger);

    // @ngInject
    function logger($log) {

        function error(message, data) {
            $log.error('Error: ' + message, data);
        }

        function info(message, data) {
            $log.info('Info: ' + message, data);
        }

        function success(message, data) {
            $log.info('Success: ' + message, data);
        }

        function warning(message, data) {
            $log.warn('Warning: ' + message, data);
        }

        var services = {
            error: error,
            info: info,
            success: success,
            warning: warning,
            log: $log.log,
            debug: $log.debug
        };

        return services;
    }

};

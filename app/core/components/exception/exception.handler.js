'use strict';

module.exports = function () {

    angular.module('core.exception')
        .config(config)
        .provider('exceptionHandler', exceptionHandler);


    // @ngInject
    function config($provide) {
        $provide.decorator('$exceptionHandler', extendExceptionHandler);
    }

    /**
     * Exception extender
     * @param $delegate
     * @param exceptionHandler
     * @param logger
     * @returns {Function}
     */
    function extendExceptionHandler($delegate, exceptionHandler, logger) {
        return function (exception, cause) {
            var appErrorPrefix = exceptionHandler.config.appErrorPrefix || '';
            var errorData = {
                exception: exception,
                cause: cause
            };
            exception.message = appErrorPrefix + exception.message;
            $delegate(exception, cause);
            /**
             *Add errors
             */
            logger.error(exception.message, errorData);
        };
    }

    /**
     * Exception Handler provider
     */
    function exceptionHandler() {
        /* jshint validthis:true */
        this.config = {
            appErrorPrefix: undefined
        };

        this.configure = function (appErrorPrefix) {
            this.config.appErrorPrefix = appErrorPrefix;
        };

        this.$get = function () {
            return {
                config: this.config
            };
        };
    }


};

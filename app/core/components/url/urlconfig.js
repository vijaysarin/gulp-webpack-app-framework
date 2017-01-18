'use strict';

module.exports = function () {

    angular
        .module('core.url')
        .provider('url', url);

    function url() {
        var baseUrl;
        // default values
        var values = {
            preAuth: 'auth/validateAppKey/v1',
            userAuth: '',
            userAccess: '',
            appConfig: '',
            comparisonMatrix: 'http://www.json-generator.com/api/json/get/clOSQnHbpK?indent=2',
            activeQuote: 'http://www.json-generator.com/api/json/get/bPXJDtDwPm?indent=2',
            checkEmail: 'user'
        };
        return {
            config: function (options) {
                baseUrl = options.baseUrl;
                values = _getFullUrl(values);
                values.baseURL = baseUrl;
            },
            set: function (constants, fullUrl) {
                if (!fullUrl) {
                    constants = getFullUrl(constants);
                }
                angular.extend(values, constants);
            },
            $get: function () {
                return values;
            }
        };

        function _getFullUrl(values) {
            var fullUrls = {};
            angular.forEach(values, function (value, key) {
                fullUrls[key] = baseUrl + '/' + value;
            });
            return fullUrls;
        }
    }

};

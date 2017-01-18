'use strict';

module.exports = function () {

    angular.module('core.http')
        .config(configInterceptor)
        .factory('httpInterceptor', httpInterceptor);

    // @ngInject
    function configInterceptor($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptor');
    }

    // @ngInject
    function httpInterceptor($q) {
        var authToken = 'asas',
            securityToken,
            appVersion,
            sessionOutCallback,
            userId = 'asas',
            langCode,
            timeStamp;

        return {
            setAppHeaderConfig: setAppHeaderConfig,
            destroy: destroy,
            setSessionOutCallback: setSessionOutCallback,
            request: requestInterceptor,
            requestError: requestErrorInterceptor,
            response: responseInterceptor,
            responseError: responseErrorInterceptor
        };

        // Set App version
        function setAppHeaderConfig(config) {
            appVersion = config.version,
                langCode = config.langCode,
                timeStamp = new Date().getTime();
        }
        // Remove the userId/request/access token
        function destroy() {
            userId = authToken = securityToken = appVersion = langCode = timeStamp = sessionOutCallback = false;
        }
        // set SessionOutCallback
        function setSessionOutCallback(callback) {
            sessionOutCallback = callback;
        }

        function requestInterceptor(config) {


            // Create requestTimestamp
            config.requestTimestamp = new Date().getTime();
            //config.timeout = 60000;

            // Set App Version
            //if (appVersion) config.headers['X-AppVersion'] = appVersion;
            // Set Request Token
            //if (securityToken) config.headers['X-SecurityToken'] = securityToken;
            // Set Auth Token
            if (authToken) config.headers['Authorization'] = authToken;
            // Set User id
            if (userId) config.headers['X-UserId'] = userId;
            // Set langCode
            //if (langCode) config.headers['X-LanguageCode'] = langCode;
            // Set timeStamp
            //if (timeStamp) config.headers['X-TimeStamp'] = timeStamp;
            config.headers['Content-Type'] = 'application/json; charset=utf-8';
            return config;
        }

        function requestErrorInterceptor() {
            // not modified
            return $q.reject(responseErr);
        }

        function responseInterceptor(response) {
            response.config.responseTimestamp = new Date().getTime();
            // Check if response having any errors
            if (response.data.errors) {
                return $q.reject(response);
            }

            // set user id
            if (!userId) {
                var responseUserId = response.headers('userId');
                if (responseUserId) {
                    userId = responseUserId;
                }
            }
            // set Requset Token
            if (!securityToken) {
                var reponseSecurityToken = response.headers('securityToken');
                if (reponseSecurityToken) {
                    securityToken = reponseSecurityToken;
                }
            }
            // set Auth Token            
            if (!authToken) {
                var reponseAuthToken = response.headers('authToken');
                if (reponseAuthToken) {
                    authToken = reponseAuthToken;
                }
            }

            return response || $q.when(response);
        }

        function responseErrorInterceptor(responseErr) {

            if (typeof responseErr.data !== 'string') {
                responseErr.data = responseErr.data || {};
            } else {
                // is string so we should not care for now
                // should be an object
                responseErr.data = {};
            }
            responseErr.data.errors = responseErr.data.errors || [];

            // if endpoint doesn't provide any errors
            // we create it and add the statusText if any
            // otherwise 'unknown error message' key
            var errors = responseErr.data.errors;
            var message = (responseErr.status === 404) ? 'URL not found' : responseErr.statusText || 'Unknown error message';
            if (errors.length <= 0) {
                errors.push({
                    code: responseErr.status,
                    message: message
                });
            }

            return $q.reject(responseErr);
        }

    }

}

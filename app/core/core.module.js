'use strict';

module.exports = angular.module('app.core', [
    'ui.router',
    'oc.lazyLoad',
    'ngSanitize',
    'pascalprecht.translate',
	require('./components/exception/exception.module').name,
	require('./components/http/http.module').name,
	require('./components/logger/logger.module').name,
	require('./components/router/router.module').name,
    require('./components/utils/utils.module').name,
	require('./components/url/url.module').name,
	require('./components/user/user.module').name
]);

require('./constants')();
require('./config')();

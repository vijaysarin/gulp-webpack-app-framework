'use strict';

module.exports = function () {

    angular.module('core.utils')
        .factory('utils', utils);

    // @ngInject
    function utils($window) {

        /**
         * Exposes <a href="https://lodash.com/docs" target="_blank">lodash</a> object.
         *
         * @memberof utils
         * @example
         * ```
         * utils.difference([3, 2, 1], [4, 2]);
         * // [3, 1]
         * ```
         */
        var _ = $window._.noConflict();


        var _utils = {};

        /**
         * Exposes <a href="http://momentjs.com/docs/" target="_blank">momentjs</a> object.
         *
         * @memberof utils
         * @example
         * ```
         * var date = utils.date().format('dddd, MMMM Do YYYY, h:mm:ss a');
         * console.log(date); // "Sunday, February 14th 2010, 3:25:50 pm"
         * ```
         */
        _utils.date = $window.moment;

        /**
         * Returns a string in ISO format, `YYYY-MM-DDTHH:mm:ss.sssZ`, UTC format.
         *
         * @memberof utils
         * @param   {Date}   date  The input date
         * @returns {String}       The ISO string representation.
         */
        _utils.dateToISOString = function (date) {
            if (Date.prototype.toISOString) {
                return Date.prototype.toISOString.call(date);
            }

            /** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString */
            return date.getUTCFullYear() +
                '-' + pad(date.getUTCMonth() + 1) +
                '-' + pad(date.getUTCDate()) +
                'T' + pad(date.getUTCHours()) +
                ':' + pad(date.getUTCMinutes()) +
                ':' + pad(date.getUTCSeconds()) +
                '.' + (date.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
                'Z';
        };

        /**
         * Executes angular digest on the given scope
         * if it's not already being executed.
         * Then invokes the function `fn`.
         *
         * @memberof utils
         * @param   {Object}  scope  Check digest phase in given `scope`
         * @param   {Function} fn  Function to execute
         */
        _utils.safeApply = function safeApply(scope, fn) {
            var phase = scope.$root.$$phase;
            if (phase === '$apply' || phase === '$digest') {
                fn();
            } else {
                scope.$apply(fn());
            }
        };

        /**
         * Removes all the html tags from `str`.
         * @memberof utils
         * @param   {String} str  Input string
         * @returns {String}
         */
        _utils.stripHtml = function (str) {
            if (!_.isString(str)) {
                // TODO: use custom log object when implemented
                console.log(str + ' is not a String');
                return '';
            }

            return str.replace(/<\/?[^>]+>/g, '');
        };


        /**
         * Given a `string` returns the json `object` equivalent.
         *
         * @memberof utils
         * @param   {String} str  The query string
         * @returns {Object} Returns a json object
         */
        _utils.parseQuerystring = function parseQuerystring(str) {
            if (!_.isString(str)) {
                return {};
            }

            str = _.trim(str);

            if (!str) {
                return {};
            }

            return _.reduce(str.split('&'), function (obj, param) {
                var parts = param.split('=');
                var key = decodeURIComponent(parts[0]);
                var val = parts[1];

                val = _.isUndefined(val) ? null : decodeURIComponent(val);

                if (obj.hasOwnProperty(key)) {
                    if (!_.isArray(obj[key])) {
                        obj[key] = [obj[key]];
                    }
                    obj[key].push(val);
                } else {
                    obj[key] = val;
                }

                return obj;
            }, {});
        };

        /**
         * Given an `object` returns its query string equivalent.
         *
         * @example
         * ```
         * utils.buildQueryString({
         *   search: 'AGL',
         *   page: 3
         * }); // "search=AGL&page=3"
         * ```
         *
         * @memberof utils
         * @param   {Object} obj  A json compliant object
         * @returns {String} Returns the query string
         */
        _utils.buildQueryString = function buildQueryString(obj) {
            if (!_.isObject(obj)) {
                return '';
            }

            return _.map(_.keys(obj), function (key) {
                var val = obj[key];

                if (_.isArray(val)) {
                    return _.map(val, function (val2) {
                        return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
                    }).join('&');
                }

                return encodeURIComponent(key) + '=' + encodeURIComponent(val);
            }).join('&');
        };


        _.mixin(_utils);

        return _;
    }

};

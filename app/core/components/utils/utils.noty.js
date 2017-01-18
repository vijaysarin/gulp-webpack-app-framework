'use strict';

module.exports = function () {

    angular.module('core.utils')
        .factory('notify', notify);

    // @ngInject
    function notify($window, utils) {
        /**
         * Generate noty text as per the type
         * @param type
         * @param text
         * @returns {*}
         */
        function notyText(type, text) {
            var types = {
                error: {
                    _class: 'error'
                },
                information: {
                    _class: 'info'
                },
                success: {
                    _class: 'success'
                },
                warning: {
                    _class: 'warning'
                }
            };
            var pattern = '<div class="message <%= _class %>"><span><i></i></span><span><%= text %></span></div>';
            var params = types[type];

            params.text = text;

            var _nText = utils.template(pattern)(params);
            return _nText;

        }

        /**
         * Generate noty message as per the type
         * @param type
         * @param options
         * @returns {*}
         */
        function notyObj(type, options) {
            var types = {
                error: {
                    _class: 'alertify-error',
                    icon: 'fa fa-times-circle fa-2x'
                },
                information: {
                    _class: 'alertify-info',
                    icon: 'fa fa-info-circle fa-2x'
                },
                success: {
                    _class: 'alertify-success',
                    icon: 'fa fa-check-circle fa-3x'
                },
                warning: {
                    _class: 'alertify-warning',
                    icon: 'fa fa-warning fa-2x'
                }
            };
            var pattern = '<div class="noty-header <%= _class %>"><i class="<%= icon %>"></i><div class="noty-heading"><%= heading %></div></div>';
            pattern += '<div class="noty-body">';
            angular.forEach(options.messages, function (value, key) {
                pattern += '<div class="dee-message"><span><i></i></span><span>' + value.message + '</span></div>';
            });
            pattern += '<div class="noty-footer"><%= footer %></div>';
            pattern += '</div>';
            var params = types[type];

            //params.text = text;
            params.heading = options.heading;
            params.footer = options.footer;

            var _nText = utils.template(pattern)(params);
            return _nText;

        }

        /**
         * Do notification with jQuery noty plugin
         * @param type
         * @param text
         */
        function notify(type, options) {
            if (typeof options === 'object') {
                var _nText = notyObj(type, options);
            } else {
                var _nText = notyText(type, options);
            }
            return $window.noty({
                text: _nText,
                type: type,
                layout: 'center',
                closeWith: ['click', 'button'],
                theme: 'relax',
                maxVisible: 1,
                //animation: {
                //    open: 'animated bounceIn',
                //    close: 'animated bounceOut',
                //    easing: 'swing',
                //    speed: 500
                //},
                modal: true,
                callback: options.callback
            });
        }

        /**
         * Notificator constructor
         * @constructor
         */
        function Notificator() {}

        /**
         * Error method to notify error
         * @param text
         * @returns {*}
         */
        Notificator.prototype.error = function (options) {
            return notify('error', options);
        };


        /**
         * Info method to notify information
         * @param text
         * @returns {*}
         */
        Notificator.prototype.info = function (options) {
            return notify('information', options);
        };


        /**
         * Success method to notify success
         * @param text
         * @returns {*}
         */
        Notificator.prototype.success = function (options) {
            return notify('success', options);
        };


        /**
         * Success method to notify warning
         * @param text
         * @returns {*}
         */
        Notificator.prototype.warning = function (options) {
            return notify('warning', options);
        };


        /**
         * To display multiple notification messages with header and footer
         * @param object response
         * @param boolean showMessage
         * @returns return value depends on boolean flag 'showMessage'
         */
        Notificator.prototype.alertify = function (response, showMessage) {
            var severity = response.clientResponse.deeMsgSeverity,
                options = {
                    heading: (response.clientResponse.clientMessage) ? response.clientResponse.deeMsg : '',
                    messages: (response.clientResponse.clientMessage) ? (response.clientResponse.clientMessage) : [{
                        'message': response.clientResponse.deeMsg
                    }],
                    footer: ''
                },
                method = '';
            if (!showMessage) {
                return severity;
            }
            if (severity == '0') {
                options.heading = (options.heading != '') ? options.heading : 'Success Message';
                method = 'success';
            } else if (severity == '1') {
                options.heading = (options.heading != '') ? options.heading : 'Info Message';
                method = 'information';
            } else if (severity == '2') {
                options.heading = (options.heading != '') ? options.heading : 'Warning Message';
                options.footer = (options.footer != '') ? options.footer : '<button class="noty-btn noty-cancel-btn">Cancel</button><button class="noty-btn noty-ok-btn">OK</button>';
                method = 'warning';
            } else if (severity == '3' || severity == '4') {
                options.heading = (options.heading != '') ? options.heading : 'Error Message';
                method = 'error';
            }
            return notify(method, options);
        };

        return new Notificator();
    }

};

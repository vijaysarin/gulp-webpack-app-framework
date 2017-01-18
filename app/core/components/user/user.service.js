'use strict';

module.exports = function () {

    angular.module('core.user').service('user', user);

    /** @ngInject */

    function user() {

        var $self = this;

        $self.getMenus = getMenus;
        $self.setMenus = setMenus;
        $self.getRole = getRole;
        $self.setRole = setRole;
        $self.isAutheticated = isAutheticated;
        $self.getSession = getSession;
        $self.setSession = setSession;


        var session;
        var userRole;
        var menus;
        var info = {};
        var defaultMenu = [{
                "menuId": 1001,
                "accessList": null,
                "menuName": "Home",
                "menuIcon": '<i class="fa fa-home fa-lg" aria-hidden="true"></i>',
                "modulePath": "login"
            },
            {
                "menuId": 1002,
                "accessList": null,
                "menuName": "Quote",
                "menuIcon": '<i class="fa fa-book fa-lg"></i>',
                "modulePath": "activeQuotes"
            },
            {
                "menuId": 1004,
                "accessList": null,
                "menuName": "Profile",
                "menuIcon": '<i class="fa fa-user fa-lg"></i>',
                "modulePath": "quote"
            },
            {
                "menuId": 1005,
                "accessList": null,
                "menuName": "Connect",
                "menuIcon": '<i class="fa fa-newspaper-o fa-lg"></i>',
                "modulePath": "comparisonMatrix"
            }];

        /**
         * Check if user is authenticated
         * @return {boolean}
         */
        function isAutheticated() {
            return (session) ? true : false;
        };

        /**
         * 
         * @returns {Object} defaultMenu
         */
        function getMenus() {
            if (!session && !userRole) {
                return defaultMenu;
            } else {
                return menus;
            }
        }

        /**
         * Sets the menu list
         * @param {Object} menuList
         * @returns {undefined}
         */
        function setMenus(menuList) {
            if (session && userRole) {
                menus = menuList;
            }
        }

        /**
         * get user session
         * @returns {session}
         */
        function getSession() {
            return session;
        };

        /**
         * Retrieves the role
         * @returns {Object} userRole
         */
        function getRole() {
            if (session) {
                return userRole;
            }
        }

        /**
         * sets the user role
         * @param {type} role
         * @returns {undefined}
         */
        function setRole(role) {
            if (session) {
                userRole = role;
            }
        }

        /**
         * Set user session
         * @param data {session details}
         */
        function setSession(data) {
            session = data;
        }


    }

};

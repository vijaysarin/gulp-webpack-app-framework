'use strict';

module.exports = function () {

    var core = angular.module('app.core');

    var constants = {};

    // General Constants
    constants.CONST = {
        copyrigths: 'TATA Consultancy Services'
    };

    /**
     * Add custom constants below
     *
     * @example
     * constants.TYPES = {
     *      inter: 'International',
     *      intra: 'Domestic'
     * }
     */

    core.constant(constants);

};

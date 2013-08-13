/* jshint browser: true, curly: true, eqeqeq: true, forin: true, latedef: true,
    newcap: true, noarg: true, noempty: true, nonew: true, strict:true,
    undef: true, unused: true */
/* global _: false, Backbone: false */

(function(_, Backbone, App) {
    'use strict';

    App.events = _.extend({}, Backbone.Events);

})(_, Backbone, window.App || (window.App = {}));
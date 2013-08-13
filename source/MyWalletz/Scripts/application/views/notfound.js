/* jshint browser: true, curly: true, eqeqeq: true, forin: true, latedef: true,
    newcap: true, noarg: true, noempty: true, nonew: true, strict:true,
    undef: true, unused: true */
/* global _: false, Backbone: false */

(function(_, Backbone, App) {
    'use strict';

    var Views = App.Views || (App.Views = {});

    Views.NotFound = Backbone.View.extend({
        el: '#not-found-page'
    });

    _.extend(Views.NotFound.prototype, Views.Activable);

})(_, Backbone, window.App || (window.App = {}));
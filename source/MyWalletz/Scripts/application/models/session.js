/* jshint browser: true, curly: true, eqeqeq: true, forin: true, latedef: true,
    newcap: true, noarg: true, noempty: true, nonew: true, strict:true,
    undef: true, unused: true */
/* global _: false, Backbone: false */

(function (_, Backbone, App) {
    'use strict';

    var Models = App.Models || (App.Models = {});

    Models.Session = Backbone.Model.extend({
        urlRoot: function () {
            return App.serverUrlPrefix + '/sessions';
        },

        defaults: function () {
            return {
                email: null,
                password: null,
                rememberMe: false
            };
        },

        validate: function (attributes) {
            var validation = Models.validation,
                errors = {};

            if (!attributes.email) {
                validation.addError(errors, 'email', 'Email is required.');
            }

            if (!attributes.password) {
                validation.addError(
                    errors,
                    'password',
                    'Password is required.');
            }

            return _.isEmpty(errors) ? void (0) : errors;
        }
    });

})(_, Backbone, window.App || (window.App = {}));
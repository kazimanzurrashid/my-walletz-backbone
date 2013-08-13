/* jshint browser: true, curly: true, eqeqeq: true, forin: true, latedef: true,
    newcap: true, noarg: true, noempty: true, nonew: true, strict:true,
    undef: true, unused: true */
/* global _: false, Backbone: false */

(function (_, Backbone, App) {
    'use strict';

    var Models = App.Models || (App.Models = {});

    Models.User = Backbone.Model.extend({
        urlRoot: function () {
            return App.serverUrlPrefix + '/users';
        },

        defaults: function () {
            return {
                email: null,
                password: null,
                confirmPassword: null
            };
        },

        validate: function (attributes) {
            var validation = Models.validation,
                errors = {};

            if (attributes.email) {
                if (!validation.isValidEmailFormat(attributes.email)) {
                    validation.addError(
                        errors,
                        'email',
                        'Invalid email address format.');
                }
            } else {
                validation.addError(errors, 'email', 'Email is required.');
            }

            if (attributes.password) {
                if (!validation.isValidPasswordLength(attributes.password)) {
                    validation.addError(
                        errors,
                        'password',
                        'Password length must be between 6 to 64 characters.');
                }
            } else {
                validation.addError(
                    errors,
                    'password',
                    'Password is required.');
            }

            if (attributes.confirmPassword) {
                if (attributes.confirmPassword !== attributes.password) {
                    validation.addError(
                        errors,
                        'confirmPassword',
                        'Password and confirm password do not match.');
                }
            } else {
                validation.addError(
                    errors,
                    'confirmPassword',
                    'Confirm password is required.');
            }

            return _.isEmpty(errors) ? void (0) : errors;
        }
    });

})(_, Backbone, window.App || (window.App = {}));
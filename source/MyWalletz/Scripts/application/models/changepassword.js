/* jshint browser: true, curly: true, eqeqeq: true, forin: true, latedef: true,
    newcap: true, noarg: true, noempty: true, nonew: true, strict:true,
    undef: true, unused: true */
/* global _: false, Backbone: false */

(function (_, Backbone, App) {
    'use strict';

    var Models = App.Models || (App.Models = {});

    Models.ChangePassword = Backbone.Model.extend({
        urlRoot: function () {
            return App.serverUrlPrefix + '/passwords/change';
        },

        defaults: function () {
            return {
                oldPassword: null,
                newPassword: null,
                confirmPassword: null
            };
        },

        validate: function (attributes) {
            var validation = Models.validation,
                errors = {};

            if (!attributes.oldPassword) {
                validation.addError(
                    errors,
                    'oldPassword',
                    'Old password is required.');
            }

            if (attributes.newPassword) {
                if (!validation.isValidPasswordLength(
                    attributes.newPassword)) {
                    validation.addError(
                        errors,
                        'newPassword',
                        'New password length must be between 6 to 64 ' +
                        'characters.');
                }
            } else {
                validation.addError(
                    errors,
                    'newPassword',
                    'New password is required.');
            }

            if (attributes.confirmPassword) {
                if (attributes.confirmPassword !== attributes.newPassword) {
                    validation.addError(
                        errors,
                        'confirmPassword',
                        'New password and confirm password do not match.');
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
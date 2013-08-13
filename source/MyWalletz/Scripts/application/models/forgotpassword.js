/* jshint browser: true, curly: true, eqeqeq: true, forin: true, latedef: true,
    newcap: true, noarg: true, noempty: true, nonew: true, strict:true,
    undef: true, unused: true */
/* global _: false, Backbone: false */

(function (_, Backbone, App) {
    'use strict';

    var Models = App.Models || (App.Models = {});

    Models.ForgotPassword = Backbone.Model.extend({
        urlRoot: function() {
            return App.serverUrlPrefix + '/passwords/forgot';
        },
        
        defaults: function() {
            return {
              email: null  
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

            return _.isEmpty(errors) ? void(0) : errors;
        }
    });

})(_, Backbone, window.App || (window.App = {}));
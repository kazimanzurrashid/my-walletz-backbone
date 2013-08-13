/* jshint browser: true, curly: true, eqeqeq: true, forin: true, latedef: true,
    newcap: true, noarg: true, noempty: true, nonew: true, strict:true,
    undef: true, unused: true */

(function (App) {
    'use strict';

    var Models = App.Models || (App.Models = {}),
        emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    Models.validation = {
        addError: function(errors, attribute, message) {
            return (errors[attribute] || (errors[attribute] = [])).push(message);
        },

        isValidEmailFormat: function(value) {
            return value && emailRegex.test(value);
        },

        isValidPasswordLength: function(value) {
            return value && value.length >= 6 && value.length <= 64;
        }
    };
})(window.App || (window.App = {}));
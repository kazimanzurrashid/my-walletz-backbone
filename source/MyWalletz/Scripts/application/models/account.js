/* jshint browser: true, curly: true, eqeqeq: true, forin: true, latedef: true,
    newcap: true, noarg: true, noempty: true, nonew: true, strict:true,
    undef: true, unused: true */
/* global _: false, Backbone: false */

(function (_, Backbone, App) {
    'use strict';

    var Models = App.Models || (App.Models = {});

    Models.Account = Backbone.Model.extend({
        defaults: function () {
            return {
                title: null,
                notes: null,
                type: null,
                balance: 0,
                currency: null
            };
        },

        validate: function (attributes) {
            var validation = Models.validation,
                errors = {};

            if (!attributes.title) {
                validation.addError(errors, 'title', 'Title is required.');
            }

            if (!attributes.type) {
                validation.addError(errors, 'type', 'Type is required.');
            }

            if (attributes.balance === null) {
                validation.addError(errors, 'balance', 'Balance is required.');
            } else {
                var balance = parseFloat(attributes.balance.toString());

                if (!_.isFinite(balance)) {
                    validation.addError(
                        errors,
                        'balance',
                        'Invalid balance, must be decimal value.');
                } else {
                    if (balance < 0) {
                        validation.addError(
                            errors,
                            'balance',
                            'Balance cannot be negative.');
                    }
                }
            }

            if (!attributes.currency) {
                validation.addError(
                    errors,
                    'currency',
                    'Currency is required.');
            }

            return _.isEmpty(errors) ? void(0) : errors;
        }
    });

    Models.Accounts = Backbone.Collection.extend({
        defaultSortAttribute: 'title',
        defaultSortOrder: App.Components.SortOrder.ascending,
        model: Models.Account,

        url: function () {
            return App.serverUrlPrefix + '/accounts';
        },

        initialize: function () {
            this.resetSorting();
        }
    });

    _.extend(Models.Accounts.prototype, App.Components.Sortable);

})(_, Backbone, window.App || (window.App = {}));
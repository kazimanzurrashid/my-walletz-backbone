/* jshint browser: true, curly: true, eqeqeq: true, forin: true, latedef: true,
    newcap: true, noarg: true, noempty: true, nonew: true, strict:true,
    undef: true, unused: true */
/* global _: false, Backbone: false */

(function(_, Backbone, App) {
    'use strict';

    var Models = App.Models || (App.Models = {});

    Models.CategoryType = {
        expense: 'Expense',
        income: 'Income'
    };

    Models.Category = Backbone.Model.extend({
        defaults: function() {
            return {
                title: null,
                type: null
            };
        },

        isExpense: function() {
            return this.isType(Models.CategoryType.expense);
        },

        isIncome: function() {
            return this.isType(Models.CategoryType.income);
        },

        isType: function(name) {
            return this.get('type') === name;
        },

        validate: function(attributes) {
            var validation = Models.validation,
                errors = {};

            if (!attributes.title) {
                validation.addError(errors, 'title', 'Title is required.');
            }

            if (attributes.type) {
                if (!_.include(
                        _.values(Models.CategoryType), attributes.type)) {
                    validation.addError(
                        errors,
                        'type',
                        'Type must be any of the following (' +
                         _.values(Models.CategoryType).join(', ') +
                         ') value.');
                }
            } else {
                validation.addError(errors, 'type', 'Type is required.');
            }

            return _.isEmpty(errors) ? void(0) : errors;
        }
    });

    Models.Categories = Backbone.Collection.extend({
        model: Models.Category,

        url: function() {
            return App.serverUrlPrefix + '/categories';
        }
    });

})(_, Backbone, window.App || (window.App = {}));
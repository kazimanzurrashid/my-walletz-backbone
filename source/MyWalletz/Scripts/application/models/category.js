var Application;

(function(_, Backbone, Application) {
    var Models = Application.Models || (Application.Models = {});

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
            var Validation = Models.Validation;
            var errors = {};

            if (!attributes.title) {
                Validation.addError(errors, 'title', 'Title is required.');
            }

            if (attributes.type) {
                if (!_.include(
                        _.values(Models.CategoryType), attributes.type)) {
                    Validation.addError(
                        errors,
                        'type',
                        'Type must be any of the following (' +
                         _.values(Models.CategoryType).join(', ') +
                         ') value.');
                }
            } else {
                Validation.addError(errors, 'type', 'Type is required.');
            }

            return _.isEmpty(errors) ? void(0) : errors;
        }
    });

    Models.Categories = Backbone.Collection.extend({
        model: Models.Category,

        url: function() {
            return Application.serverUrlPrefix + '/categories';
        }
    });

})(_, Backbone, Application || (Application = {}));
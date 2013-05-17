var Application;

(function (_, Backbone, Application) {
    var Models = Application.Models || (Application.Models = {});

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
            var Validation = Models.Validation;
            var errors = {};

            if (!attributes.title) {
                Validation.addError(errors, 'title', 'Title is required.');
            }

            if (!attributes.type) {
                Validation.addError(errors, 'type', 'Type is required.');
            }

            if (attributes.balance == null) {
                Validation.addError(errors, 'balance', 'Balance is required.');
            } else {
                var balance = parseFloat(attributes.balance.toString());

                if (!_.isFinite(balance)) {
                    Validation.addError(
                        errors,
                        'balance',
                        'Invalid balance, must be decimal value.');
                } else {
                    if (balance < 0) {
                        Validation.addError(
                            errors,
                            'balance',
                            'Balance cannot be negative.');
                    }
                }
            }

            if (!attributes.currency) {
                Validation.addError(
                    errors,
                    'currency',
                    'Currency is required.');
            }

            return _.isEmpty(errors) ? void(0) : errors;
        }
    });

    Models.Accounts = Backbone.Collection.extend({
        defaultSortAttribute: 'title',
        defaultSortOrder: Application.Components.SortOrder.ascending,
        model: Models.Account,

        url: function () {
            return Application.serverUrlPrefix + '/accounts';
        },
        
        initialize: function () {
            this.resetSorting();
        }
    });

    _.extend(Models.Accounts.prototype, Application.Components.Sortable);

})(_, Backbone, Application || (Application = {}));
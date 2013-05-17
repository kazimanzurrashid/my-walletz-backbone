var Application;

(function (_, Backbone, Application) {
    var Models = Application.Models || (Application.Models = {});

    Models.Transaction = Backbone.Model.extend({
        defaults: function () {
            return {
                postedAt: null,
                payee: null,
                notes: null,
                categoryId: null,
                accountId: null,
                amount: 0
            };
        },

        getAccount: function(accounts) {
            var accountId = this.get('accountId');
            return accountId && accounts.get(accountId);
        },

        getCategory: function(categories) {
            var categoryId = this.get('categoryId');
            return categoryId && categories.get(categoryId);
        },

        validate: function (attributes, options) {
            var Validation = Models.Validation;
            var errors = {};

            if (!attributes.postedAt) {
                Validation.addError(
                    errors,
                    'postedAt',
                    'Posted at is required.');
            }

            if (options.validateCategory && !attributes.categoryId) {
                Validation.addError(
                    errors,
                    'categoryId',
                    'Category is required.');
            }

            if (!attributes.amount) {
                Validation.addError(errors, 'amount', 'Amount is required.');
            } else {
                var amount = parseFloat(attributes.amount.toString());

                if (!_.isFinite(amount)) {
                    Validation.addError(
                        errors,
                        'amount',
                        'Invalid amount, must be decimal value.');
                } else {
                    if (amount <= 0) {
                        Validation.addError(
                            errors,
                            'amount',
                            'Amount must be positive decimal value.');
                    }
                }
            }

            return _.isEmpty(errors) ? void(0) : errors;
        }
    });

    Models.Transactions = Backbone.Collection.extend({
        defaultSortAttribute: 'postedat',
        defaultSortOrder: Application.Components.SortOrder.descending,
        countAttribute: 'count',
        resultAttribute: 'data',
        defaultPageSize: 10,
        model: Models.Transaction,

        url: function () {
            if (!this.accountId) {
                throw new Error("Account id must be set!");
            }
            
            return Application.serverUrlPrefix +
                '/accounts/' +
                this.accountId + '/transactions';
        },

        initialize: function () {
            this.resetPaging();
        },

        create: function (attributes) {
            if (!attributes.accountId) {
                attributes.accountId = this.accountId;
            }

            return Backbone.Collection.prototype.create.call(
                this,
                arguments);
        }
    });

    _.extend(Models.Transactions.prototype, Application.Components.Pageable);

    Models.TransactionCollectionsManager = (function () {

        function TransactionCollectionsManager(categories, accounts) {
            this.categories = categories;
            this.accounts = accounts;
            this.collections = {};
        }

        TransactionCollectionsManager.prototype = {
            collectionType: Models.Transactions,

            getOrCreate: function(accountId) {
                var self = this;
                var collection = self.collections[accountId];

                if (!collection) {
                    collection = new self.collectionType;
                    collection.accountId = accountId;
                    collection.on('add', function (transaction) {
                        var category = transaction.getCategory(
                            self.categories);

                        if (category) {
                            var account = transaction.getAccount(
                                self.accounts);
                            var amount = transaction.get('amount');
                            var oldBalance = account.get('balance');
                            var isChanged = false;
                            var newBalance = oldBalance;

                            if (category.isExpense()) {
                                newBalance = oldBalance - amount;
                                isChanged = true;
                            } else {
                                if (category.isIncome()) {
                                    newBalance = oldBalance + amount;
                                    isChanged = true;
                                }
                            }

                            if (isChanged) {
                                account.set({
                                    balance: newBalance
                                });
                            }
                        }
                    });

                    this.collections[accountId] = collection;
                }

                return collection;
            },

            reset: function () {
                _.chain(this.collections)
                 .values()
                 .each(function (c) {
                    c.off('add');
                    c.reset();
                });

                this.collections = { };
            }
        };

        return TransactionCollectionsManager;
    })();

})(_, Backbone, Application || (Application = {}));
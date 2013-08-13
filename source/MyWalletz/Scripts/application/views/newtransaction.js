/* jshint browser: true, curly: true, eqeqeq: true, forin: true, latedef: true,
    newcap: true, noarg: true, noempty: true, nonew: true, strict:true,
    undef: true, unused: true */
/* global jQuery: false, _: false, Backbone: false */

(function($, _, Backbone, App) {
    'use strict';

    var Views = App.Views || (App.Views = {});

    function createListOptions(label, categories) {
        var options = _.map(categories, function(c) {
            return '<option value="' + c.id + '">' + c.get('title') + '</option>';
        });
        return '<optgroup label="' + label + '">' + options.join() + '</optgroup>';
    }

    Views.NewTransaction = Backbone.View.extend({
        el: '#new-transaction-page',

        events: {
            'submit form': 'onSave'
        },

        initialize: function(options) {
            this.router = options.router;

            this.categories = options.categories;
            this.listenTo(
                this.categories,
                'add remove destroy change:title reset',
                this.populateCategories);

            this.form = this.$('form');
            this.categoryList = this.form.find('#new-transaction-category');
            this.currencyDisplay = this.form.find('#new-transaction-currency');
            this.cancelLink = this.form.find('.form-actions > a.btn');

            this.populateCategories();
        },

        load: function(account, transactions) {
            this.currencyDisplay.text(account.get('currency'));
            this.cancelLink.prop(
                'href',
                App.clientUrl(
                    '/accounts',
                    account.id,
                    'transactions'));
            this.account = account;
            this.collection = transactions;
        },

        populateCategories: function() {
            var expenses, incomes;

            expenses = this.categories.filter(function(c) {
                return c.isExpense();
            });

            incomes = this.categories.filter(function(c) {
                return c.isIncome();
            });

            this.categoryList.empty()
                .append($('<option/>', {
                    text: '[select]',
                    value: ''
                }));

            if (expenses.length) {
                this.categoryList.append(
                    $(createListOptions('Expenses', expenses)));
            }

            if (incomes.length) {
                this.categoryList.append(
                    $(createListOptions('Incomes', incomes)));
            }
        },

        onActivate: function() {
            this.form.putFocus();
        },

        onDeactivate: function() {
            this.form.hideFieldErrors().resetFields();
        },

        onSave: function(e) {
            var transaction = new App.Models.Transaction(),
                self = this;

            e.preventDefault();
            this.form.hideFieldErrors();

            Views.helpers.subscribeModelInvalidEvent(transaction, this.form);

            if (!transaction.set(this.form.serializeFields(), {
                validate: true,
                validateCategory: true
            })) {
                return;
            }

            this.collection.create(transaction, {
                wait: true,
                validate: false,
                success: function() {
                    self.router.navigate(
                        App.clientUrl(
                            '/accounts',
                            self.account.id,
                            'transactions'),
                        true);
                    $.showSuccessbar('New transaction created.');
                },
                error: function(model, jqxhr) {
                    var modelErrors;

                    if (Views.helpers.hasModelErrors(jqxhr)) {
                        modelErrors = Views.helpers.getModelErrors(jqxhr);

                        if (modelErrors) {
                            self.form.showFieldErrors({
                                errors: modelErrors
                            });
                            return;
                        }
                    }
                    $.showErrorbar('An unexpected error has occurred ' +
                        'while creating new transaction.');
                }
            });
        }
    });

    _.extend(Views.NewTransaction.prototype, Views.Activable);

})(jQuery, _, Backbone, window.App || (window.App = {}));
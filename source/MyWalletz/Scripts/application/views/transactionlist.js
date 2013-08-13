/* jshint browser: true, curly: true, eqeqeq: true, forin: true, latedef: true,
    newcap: true, noarg: true, noempty: true, nonew: true, strict:true,
    undef: true, unused: true */
/* global jQuery: false, _: false, Backbone: false */

(function ($, _, Backbone, App) {
    'use strict';

    var Views = App.Views || (App.Views = {});

    Views.TransactionList = Backbone.View.extend({
        el: '#transaction-list-page',

        initialize: function (options) {
            this.router = options.router;
            this.categories = options.categories;
            
            this.pageHeader = this.$('.page-header');
            this.balanceDisplay = this.$('#transaction-list-balance');
            this.newTransactionLink = this.$('.form-actions > .btn');

            this.dataGrid = new App.Components.DataGrid({
                el: this.$('.data-grid'),
                rowTemplate: _.template(this.$('#transaction-grid-row-template').html())
            });
            this.listenTo(this.dataGrid, 'sort', this.onSort);
            this.listenTo(this.dataGrid, 'rowRender', this.onRowRender);
            
            this.dataPager = new App.Components.DataPager({
                el: this.$('.pagination'),
                showFirstAndLast: true
            });
            this.listenTo(this.dataPager, 'pageChanged', this.onPageChanged);
        },

        render: function () {
            this.renderPageTitle();
            this.dataGrid.render();
            this.renderBalance();
            this.dataPager.render();
            this.renderNewTransactionLink();

            return this;
        },

        load: function(account, transactions) {
            this.account = account;
            this.collection = transactions;
            this.listenTo(this.account, 'change:title', this.renderPageTitle);
            this.listenTo(this.account, 'change:balance change:currency', this.renderBalance);
            this.dataGrid.setColection(this.collection);
            this.dataPager.setColection(this.collection);
            return this;
        },

        renderPageTitle: function() {
            var pageTitle = this.account.get('title') + ' transactions';
            this.pageHeader.text(pageTitle);
        },

        renderBalance: function() {
            var balance = Views.helpers.formatMoney(
                this.account.get('balance'),
                this.account.get('currency'));
            this.balanceDisplay.text(balance);
        },

        renderNewTransactionLink: function() {
            var newLink = App.clientUrl(
                '/accounts',
                this.account.id,
                'transactions',
                'new');
            this.newTransactionLink.prop('href', newLink);
        },

        onDeactivate: function () {
            if (this.acoount) {
                this.stopListening(this.account);
            }
        },

        onSort: function(e){
            var order = e.order === App.Components.SortOrder.descending ?
                'descending' :
                'ascending';

            e.preventDefault();

            this.router.navigate(
                App.clientUrl(
                    '/accounts',
                    this.account.id,
                    'transactions',
                    '1',
                    e.attribute,
                    order),
                true);
        },

        onRowRender: function(e) {
            var model = e.dataModel.toJSON(),
                category = (e.dataModel).getCategory(this.categories),
                categoryTitle = '';

            if (category) {
                categoryTitle = category.get('type') + ' » ' + category.get('title');
                if (category.isExpense()) {
                    model.amount = -model.amount;
                }
            }

            model.categoryTitle = categoryTitle;

            e.viewModel = _.extend(model, {
                formattedPostedAt: function () {
                    return Views.helpers.formatDate(this.postedAt);
                },
                formattedAmount: function () {
                    return Views.helpers.formatMoney(this.amount);
                }
            });
        },

        onPageChanged: function(e) {
            var pageable = this.collection,
                attribute = pageable.sortAttribute,
                order = pageable.sortOrder === App.Components.SortOrder.descending ?
                'descending' :
                'ascending';

            this.router.navigate(
                App.clientUrl(
                    '/accounts',
                    this.account.id,
                    'transactions',
                    e.page,
                    attribute,
                    order),
                true);
        }
    });

    _.extend(Views.TransactionList.prototype, Views.Activable);

})(jQuery, _, Backbone, window.App || (window.App = {}));
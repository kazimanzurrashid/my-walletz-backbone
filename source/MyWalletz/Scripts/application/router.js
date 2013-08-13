/* jshint browser: true, curly: true, eqeqeq: true, forin: true, latedef: true,
    newcap: true, noarg: true, noempty: true, nonew: true, strict:true,
    undef: true, unused: true */
/* global _: false, jQuery: false, Backbone: false */

(function($, _, Backbone, App) {
    'use strict';
    
    App.Router = Backbone.Router.extend({
        routes: {
            '!/accounts/:id/transactions/new': 'newTransaction',
            '!/accounts/:id/transactions/:page/:sortAttribute/:sortOrder': 'transactionList',
            '!/accounts/:id/transactions/:page/:sortAttribute': 'transactionList',
            '!/accounts/:id/transactions/:page': 'transactionList',
            '!/accounts/:id/transactions': 'transactionList',
            '!/accounts/:id/edit': 'editAccount',
            '!/accounts/new': 'newAccount',
            '!/accounts/:sortAttribute/:sortOrder': 'accountList',
            '!/accounts/:sortAttribute': 'accountList',
            '!/accounts': 'accountList',
            '!/categories': 'categoryList',
            '!/about': 'about',
            '!/': 'home',
            '*path': 'notFound'
        },

        initialize: function (options) {
            this.context = options.context;

            this.navigationView = new App.Views.Navigation({
                collection: this.context.accounts
            }).render();

            this.newTransactionView = new App.Views.NewTransaction({
                categories: this.context.categories,
                router: this
            });

            this.transactionListView = new App.Views.TransactionList({
                categories: this.context.categories,
                router: this
            });
            
            this.editAccountView = new App.Views.EditAccount({
                router: this
            });

            this.newAccountView = new App.Views.NewAccount({
                collection: this.context.accounts,
                router: this
            });

            this.accountListView = new App.Views.AccountList({
                collection: this.context.accounts,
                router: this
            }).render();

            this.categoryListView = new App.Views.CategoryTabbedList({
                collection: this.context.categories
            }).render();

            var pageTemplate = _($('#page-template').html()).template();

            this.homeView = new App.Views.Page({
                className: 'page',
                template: pageTemplate,
                model: new Backbone.Model({
                    title: 'Home',
                    content: '<h4>Welcome to Backbone.js SPA</h4>' +
                        '<p>Backbone.js SPA is starter kit template to develop ' +
                        'single page application with Backbone.js in ' +
                        'Microsoft Technology Stack. Some of the key ' +
                        'technology used in this template are:</p>' +
                        '<ol>' +
                        '<li><a href="http://backbonejs.org/">Backbone.js</a></li>' +
                        '<li><a href="http://twitter.github.com/bootstrap/">Twitter Bootstrap</a></li>' +
                        '<li><a href="http://fortawesome.github.com/Font-Awesome/">Font Awesome</a></li>' +
                        '<li><a href="http://aboutcode.net/postal/">Postal</a></li>' +
                        '<li><a href="http://www.asp.net/web-api">ASP.NET Web API</a></li>' +
                        '<li><a href="http://www.asp.net/mvc">ASP.NET MVC</a></li>' +
                        '<li>and many more...</li>' +
                        '</ol>' +
                        '<p>To get the latest update visit the ' +
                        '<a href="https://github.com/kazimanzurrashid/AspNetMvcBackboneJsSpa">Project Page</a> ' +
                        'or follow me <a href="https://twitter.com/manzurrashid">@manzurrashid</a>.</p>'
                })
            });

            this.aboutView = new App.Views.Page({
                className: 'page',
                template: pageTemplate,
                model: new Backbone.Model({
                    title: 'About',
                    content: 'Tell us about your app.'
                })
            });

            $('#container').prepend(
                this.homeView.render().$el,
                this.aboutView.render().$el);

            this.notFoundView = new App.Views.NotFound();
        },

        newTransaction: function(id) {
            this.ensureSignedIn(_(function () {
                var account = this.context.getAccount(id),
                    transactions;

                if (!account) {
                    this.notFound();
                    return;
                }

                transactions = this.context.getOrCreateTransactions(id);
                this.newTransactionView.load(account, transactions);
                this.activate(this.newTransactionView, 'transactions-menu');
            }).bind(this));
        },

        transactionList: function(id, page, sortAttribute, sortOrder) {
            if (_(page).isUndefined()) {
                page = 1;
            }

            if (_(sortAttribute).isUndefined()) {
                sortAttribute = 'postedAt';
            }

            if (_(sortOrder).isUndefined()) {
                sortOrder = 'descending';
            }

            this.ensureSignedIn(_(function () {
                var account = this.context.getAccount(id),
                    transactions;
                
                if (!account) {
                    this.notFound();
                    return;
                }

                transactions = this.context.getOrCreateTransactions(id);
                this.setSorting(transactions, sortAttribute, sortOrder);
                transactions.pageIndex = page - 1;
                transactions.fetch({
                    reset: true
                });
                this.transactionListView.load(account, transactions).render();
                this.activate(this.transactionListView, 'transactions-menu');
            }).bind(this));
        },

        editAccount: function(id) {
            this.ensureSignedIn(_(function() {
                var account = this.context.getAccount(id);
                if (!account) {
                    this.notFound();
                    return;
                }
                this.editAccountView.load(account);
                this.activate(this.editAccountView, 'accounts-menu');
            }).bind(this));
        },

        newAccount: function() {
            this.ensureSignedIn(_(function() {
                return this.activate(this.newAccountView, 'accounts-menu');
            }).bind(this));
        },

        accountList: function(sortAttribute, sortOrder) {
            if (_.isUndefined(sortAttribute)) {
                sortAttribute = 'postedAt';
            }

            if (_.isUndefined(sortOrder)) {
                sortOrder = 'descending';
            }

            this.ensureSignedIn(_(function () {
                this.setSorting(this.context.accounts, sortAttribute, sortOrder);
                this.context.accounts.sort();
                this.activate(this.accountListView, 'accounts-menu');
            }).bind(this));
        },

        categoryList: function() {
            this.ensureSignedIn(_(function () {
                this.activate(this.categoryListView, 'categories-menu');
            }).bind(this));
        },

        about: function () {
            this.activate(this.aboutView, 'about-menu');
        },

        home: function() {
            this.activate(this.homeView, 'home-menu');
        },

        notFound: function() {
            this.activate(this.notFoundView);
        },

        activate: function (view, menu) {
            if (this.currentView) {
                if (this.currentView === view) {
                    return;
                }
                this.currentView.deactivate();
            }

            if (_.isUndefined(menu)) {
                this.navigationView.deselectAll();
            } else {
                this.navigationView.select(menu);
            }

            this.currentView = view;
            this.currentView.activate();
        },

        ensureSignedIn: function(action) {
            if (!this.context.isUserSignedIn()) {
                App.events.trigger('showMembership', {
                    ok: _.bind(function() {
                        if (this.context.isUserSignedIn()) {
                            action();
                            return;
                        }
                        this.navigate(App.clientUrl('/'), true);
                    }, this),
                    cancel: _.bind(function () {
                        this.navigate(App.clientUrl('/'), true);
                    }, this)
                });
                return;
            }

            action();
        },

        setSorting: function (target, attribute, order) {
            target.sortAttribute = attribute;
            target.sortOrder = order === 'descending' ?
                App.Components.SortOrder.descending :
                App.Components.SortOrder.ascending;
        }
    });

})(jQuery, _, Backbone, window.App || (window.App = {}));
var Application;

(function($, _, Backbone, Application) {

    function setSorting(target, attribute, order) {
        target.sortAttribute = attribute;
        target.sortOrder = order === 'descending' ?
            Application.Components.SortOrder.descending :
            Application.Components.SortOrder.ascending;

    }

    Application.Router = Backbone.Router.extend({
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

            this.navigationView = new Application.Views.Navigation({
                collection: this.context.accounts
            }).render();

            this.newTransactionView = new Application.Views.NewTransaction({
                categories: this.context.categories,
                router: this
            });

            this.transactionListView = new Application.Views.TransactionList({
                categories: this.context.categories,
                router: this
            });
            
            this.editAccountView = new Application.Views.EditAccount({
                router: this
            });

            this.newAccountView = new Application.Views.NewAccount({
                collection: this.context.accounts,
                router: this
            });

            this.accountListView = new Application.Views.AccountList({
                collection: this.context.accounts,
                router: this
            }).render();

            this.categoryListView = new Application.Views.CategoryTabbedList({
                collection: this.context.categories
            }).render();

            var pageTemplate = _.template($('#page-template').html());

            this.homeView = new Application.Views.Page({
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

            this.aboutView = new Application.Views.Page({
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

            this.notFoundView = new Application.Views.NotFound();
        },

        newTransaction: function(id) {
            var self = this;

            this.ensureSignedIn(function () {
                var account = self.context.getAccount(id);
                if (!account) {
                    self.notFound();
                    return;
                }
                var transactions = self.context.getOrCreateTransactions(id);
                self.newTransactionView.load(account, transactions);
                self.activate(self.newTransactionView, 'transactions-menu');
            });
        },

        transactionList: function(id, page, sortAttribute, sortOrder) {
            page || (page = 1);
            sortAttribute || (sortAttribute = 'postedAt');
            sortOrder || (sortOrder = 'descending');

            var self = this;

            this.ensureSignedIn(function () {
                var account = self.context.getAccount(id);
                if (!account) {
                    self.notFound();
                    return;
                }
                var transactions = self.context.getOrCreateTransactions(id);
                setSorting(transactions, sortAttribute, sortOrder);
                transactions.pageIndex = page - 1;
                transactions.fetch({
                    reset: true
                });
                self.transactionListView.load(account, transactions).render();
                self.activate(self.transactionListView, 'transactions-menu');
            });
        },

        editAccount: function() {
            var self = this;
            this.ensureSignedIn(function() {
                var account = self.context.getAccount(id);
                if (!account) {
                    self.notFound();
                    return;
                }
                self.editAccountView.load(account);
                self.activate(self.editAccountView, 'accounts-menu');
            });
        },

        newAccount: function() {
            var self = this;
            this.ensureSignedIn(function() {
                return self.activate(self.newAccountView, 'accounts-menu');
            });
        },

        accountList: function(sortAttribute, sortOrder) {
            sortAttribute || (sortAttribute = 'title');
            sortOrder || (sortOrder = 'ascending');

            var self = this;

            this.ensureSignedIn(function () {
                setSorting(self.context.accounts, sortAttribute, sortOrder);
                self.context.accounts.sort();
                self.activate(self.accountListView, 'accounts-menu');
            });
        },

        categoryList: function() {
            var self = this;
            this.ensureSignedIn(function () {
                self.activate(self.categoryListView, 'categories-menu');
            });
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
            
            if (menu) {
                this.navigationView.select(menu);
            } else {
                this.navigationView.deselectAll();
            }
            
            this.currentView = view;
            this.currentView.activate();
        },
        
        ensureSignedIn: function(action) {
            var self = this;

            if (!this.context.isUserSignedIn()) {
                Application.events.trigger('showMembership', {
                    ok: function() {
                        if (self.context.isUserSignedIn()) {
                            action();
                            return;
                        }
                        self.navigate(Application.clientUrl('/'), true);
                    },
                    cancel: function () {
                        self.navigate(Application.clientUrl('/'), true);
                    }
                });
                return;
            }

            action();
        }
    });

})(jQuery, _, Backbone, Application || (Application = {}));
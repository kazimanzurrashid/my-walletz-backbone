var Application;

(function (Application) {

    Application.Context = (function() {

        function Context(options) {
            var Models = Application.Models;

            this.categories = new Application.Models.Categories;
            if (options && options.categories && options.categories.length) {
                this.categories.reset(options.categories);
            }

            this.accounts = new Application.Models.Accounts;
            if (options && options.accounts && options.accounts.length) {
                this.accounts.reset(options.accounts);
            }

            this.transactionCollectionsManager = new Models
                .TransactionCollectionsManager(this.categories, this.accounts);

            if (options.userSignnedIn) {
                this.userSignedIn({ load: false });
            }
        }

        Context.prototype = {
            isUserSignedIn: function() {
                return this.signedIn;
            },
            
            userSignedIn: function (options) {
                options || (options = { load: true });
                
                this.signedIn = true;
                
                if (options.load) {
                    this.accounts.fetch({
                        reset: true
                    });
                    this.categories.fetch({
                        reset: true
                    });
                }
            },
            
            userSignedOut: function() {
                this.signedIn = false;
                this.categories.reset();
                this.accounts.reset();
                this.transactionCollectionsManager.reset();
            },
            
            getAccount: function(id) {
                return this.accounts.get(id);
            },
            
            getOrCreateTransactions: function (id) {
                return this.transactionCollectionsManager.getOrCreate(id);
            }
        };

        return Context;
    })();

})(Application || (Application = {}));
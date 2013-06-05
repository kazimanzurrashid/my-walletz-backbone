var Application;

(function ($, _, Backbone, Application) {
    var Views = Application.Views || (Application.Views = {});

    Views.NewAccount = Backbone.View.extend({
        el: '#new-account-page',

        events: {
            'submit form': 'onSave'
        },

        initialize: function(options) {
            this.router = options.router;
            this.form = this.$('form');
        },

        onActivate: function() {
            this.form.putFocus();
        },

        onDeactivate: function() {
            this.form.hideFieldErrors().resetFields();
        },

        onSave: function(e) {
            e.preventDefault();
            this.form.hideFieldErrors();

            var account = new Application.Models.Account;

            Views.Helpers.subscribeModelInvalidEvent(account, this.form);

            var attributes = _.extend(this.form.serializeFields(), {
                createdAt: new Date()
            });

            if (!account.set(attributes, { validate: true })) {
                return;
            }

            var self = this;

            this.collection.create(account, {
                wait: true,
                validate: false,
                success: function() {
                    self.router.navigate(
                        Application.clientUrl('/accounts'),
                        true);
                    $.showSuccessbar('New account created.');
                },
                error: function(model, jqxhr) {
                    if (Views.Helpers.hasModelErrors(jqxhr)) {
                        var modelErrors = Views.Helpers.getModelErrors(jqxhr);
                        if (modelErrors) {
                            self.form.showFieldErrors({
                                errors: modelErrors
                            });
                            return;
                        }
                    }
                    $.showErrorbar('An unexpected error has occurred while ' +
                        'creating new account.');
                }
            });
        }
    });

    _.extend(Views.NewAccount.prototype, Views.Activable);

})(jQuery, _, Backbone, Application || (Application = {}));
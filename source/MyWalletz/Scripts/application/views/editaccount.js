var Application;

(function ($, _, Backbone, Application) {
    var Views = Application.Views || (Application.Views = {});

    Views.EditAccount = Backbone.View.extend({
        el: '#edit-account-page',

        events: {
            'submit form': 'onSave'
        },

        initialize: function(options) {
            this.router = options.router;
            this.form = this.$('form');
            this.currencyDisplay = this.form.find('#edit-account-currency');
            this.balanceDisplay = this.form.find('#edit-account-balance');
        },

        load: function(account) {
            this.model = account;

            this.form.deserializeFields(this.model.attributes);
            this.currencyDisplay.text(this.model.get('currency'));
            this.balanceDisplay.text(
                Views.Helpers.formatMoney(this.model.get('balance')));

            return this;
        },

        onActivate: function() {
            this.form.putFocus();
        },

        onDeactivate: function() {
            this.form.hideFieldErrors().resetFields();
            this.currencyDisplay.text('');
            this.balanceDisplay.text('');
        },

        onSave: function(e) {
            e.preventDefault();
            this.form.hideFieldErrors();

            View.Helpers.subscribeModelInvalidEvent(this.model, this.form);

            var self = this;

            this.model.save(this.form.serializeFields(), {
                success: function() {
                    self.router.navigate(Application.clientUrl('/accounts'), true);
                    $.showSuccessbar('<strong>' +
                        self.model.get('title') +
                        '</strong> account updated.');
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
                        'updating <strong>' +
                        model.get('title') +
                        '</strong> account.');
                }
            });
        }
    });

    _.extend(Views.EditAccount.prototype, Views.Activable);

})(jQuery, _, Backbone, Application || (Application = {}));
/* jshint browser: true, curly: true, eqeqeq: true, forin: true, latedef: true,
    newcap: true, noarg: true, noempty: true, nonew: true, strict:true,
    undef: true, unused: true */
/* global jQuery: false, _: false, Backbone: false */

(function ($, _, Backbone, App) {
    'use strict';

    var Views = App.Views || (App.Views = {});

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
                Views.helpers.formatMoney(this.model.get('balance')));

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
            var self = this;

            e.preventDefault();
            this.form.hideFieldErrors();

            Views.helpers.subscribeModelInvalidEvent(this.model, this.form);

            this.model.save(this.form.serializeFields(), {
                success: function() {
                    self.router.navigate(App.clientUrl('/accounts'), true);
                    $.showSuccessbar('<strong>' +
                        self.model.get('title') +
                        '</strong> account updated.');
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
                    $.showErrorbar('An unexpected error has occurred while ' +
                        'updating <strong>' +
                        model.get('title') +
                        '</strong> account.');
                }
            });
        }
    });

    _.extend(Views.EditAccount.prototype, Views.Activable);

})(jQuery, _, Backbone, window.App || (window.App = {}));
/* jshint browser: true, curly: true, eqeqeq: true, forin: true, latedef: true,
    newcap: true, noarg: true, noempty: true, nonew: true, strict:true,
    undef: true, unused: true */
/* global jQuery: false, _: false, Backbone: false */

(function ($, _, Backbone, App) {
    'use strict';

    var Views = App.Views || (App.Views = {});

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
            var account = new App.Models.Account(),
                self = this,
                attributes;

            e.preventDefault();
            this.form.hideFieldErrors();

            Views.helpers.subscribeModelInvalidEvent(account, this.form);

            attributes = _.extend(this.form.serializeFields(), {
                createdAt: new Date()
            });

            if (!account.set(attributes, { validate: true })) {
                return;
            }

            this.collection.create(account, {
                wait: true,
                validate: false,
                success: function() {
                    self.router.navigate(
                        App.clientUrl('/accounts'),
                        true);
                    $.showSuccessbar('New account created.');
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
                        'creating new account.');
                }
            });
        }
    });

    _.extend(Views.NewAccount.prototype, Views.Activable);

})(jQuery, _, Backbone, window.App || (window.App = {}));
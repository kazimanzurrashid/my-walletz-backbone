/* jshint browser: true, curly: true, eqeqeq: true, forin: true, latedef: true,
    newcap: true, noarg: true, noempty: true, nonew: true, strict:true,
    undef: true, unused: true */
/* global jQuery: false, _: false, Backbone: false */

(function ($, _, Backbone, App) {
    'use strict';

    var Views = App.Views || (App.Views = {});

    Views.Profile = Backbone.View.extend({
        el: '#profile-dialog',

        events: {
            'shown': 'onDialogShown',
            'submit form': 'onChangePassword',
            'click #sign-out-button': 'onSignOut'
        },

        ChangePasswordModel: App.Models.ChangePassword,
        SessionModel: App.Models.Session,

        initialize: function () {
            this.changePasswordForm = this.$('form');
            this.$el.modal({ show: false });
            this.listenTo(App.events, 'showProfile', this.onShowProfile);
        },

        onShowProfile: function () {
            this.changePasswordForm
                .resetFields()
                .hideSummaryError()
                .hideFieldErrors();
            
            this.$el.modal('show');
        },

        onDialogShown: function () {
            this.changePasswordForm.putFocus();
        },

        onChangePassword: function (e) {
            var model = new this.ChangePasswordModel(),
                self = this;

            e.preventDefault();
            this.changePasswordForm
                .hideSummaryError()
                .hideFieldErrors();

            Views.helpers.subscribeModelInvalidEvent(model, this.changePasswordForm);

            model.save(this.changePasswordForm.serializeFields(), {
                success: function() {
                    self.$el.modal('hide');
                    App.events.trigger('passwordChanged');
                },
                error: function(m, jqxhr) {
                    var modelErrors;
                    if (Views.helpers.hasModelErrors(jqxhr)) {
                        modelErrors = Views.helpers.getModelErrors(jqxhr);

                        if (modelErrors) {
                            self.changePasswordForm.showFieldErrors({
                                errors: modelErrors
                            });
                            return;
                        }
                    }
                    self.changePasswordForm.showSummaryError({
                        message: 'An unexpected error has occurred while ' + 'changing your password.'
                    });
                }
            });
        },

        onSignOut: function (e) {
            var self = this;

            e.preventDefault();

            this.$el.modal('hide');

            $.confirm({
                prompt: 'Are you sure you want to sign out?',
                ok: function () {
                    return (new self.SessionModel({
                        id: Date.now()
                    })).destroy({
                        success: function() {
                            App.events.trigger('signedOut');
                        }
                    });
                }
            });
        }
    });

})(jQuery, _, Backbone, window.App || (window.App = {}));
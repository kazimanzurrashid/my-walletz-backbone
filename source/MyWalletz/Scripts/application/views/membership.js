/* jshint browser: true, curly: true, eqeqeq: true, forin: true, latedef: true,
    newcap: true, noarg: true, noempty: true, nonew: true, strict:true,
    undef: true, unused: true */
/* global _: false, Backbone: false */

(function (_, Backbone, App) {
    'use strict';

    var Views = App.Views || (App.Views = {});

    Views.MembershipChildForm = Backbone.View.extend({
        events: {
            'submit': 'onSubmit'
        },

        handleError: function() {
            throw new Error('Not Implemented');
        },

        onSubmit: function(e) {
            var self = this,
                model = new this.Model();

            e.preventDefault();

            this.$el.hideSummaryError()
                .hideFieldErrors();

            Views.helpers.subscribeModelInvalidEvent(model, this.$el);
            
            model.save(this.$el.serializeFields(), {
                success: function () {
                    return App.events.trigger(self.successEvent);
                },
                error: function (m, jqxhr) {
                    return self.handleError(jqxhr);
                }
            });
        }
    });

    Views.SignIn = Views.MembershipChildForm.extend({
        el: '#sign-in-form',
        Model: App.Models.Session,
        successEvent: 'signedIn',

        handleError: function (jqxhr) {
            var message = Views.helpers.hasModelErrors(jqxhr) ?
                'Invalid credentials.' :
                'An unexpected error has occurred while signing in.';

            this.$el.showSummaryError({
                message: message
            });
        }
    });

    Views.ForgotPassword = Views.MembershipChildForm.extend({
        el: '#forgot-password-form',
        Model: App.Models.ForgotPassword,
        successEvent: 'passwordResetRequested',

        handleError: function () {
            this.$el.showSummaryError({
                message: 'An unexpected error has occurred while ' +
                'requesting password reset.'
            });
        }
    });

    Views.SignUp = Views.MembershipChildForm.extend({
        el: '#sign-up-form',
        Model: App.Models.User,
        successEvent: 'signedUp',

        handleError: function (jqxhr) {
            var modelErrors;

            if (Views.helpers.hasModelErrors(jqxhr)) {
                modelErrors = Views.helpers.getModelErrors(jqxhr);
                if (modelErrors) {
                    this.$el.showFieldErrors({
                        errors: modelErrors
                    });
                    return;
                }
            }

            this.$el.showSummaryError({
                message: 'An unexpected error has occurred while ' +
                    'signing up.'
            });
        }
    });

    Views.Membership = Backbone.View.extend({
        el: '#membership-dialog',
        events: {
            'shown a[data-toggle="tab"]': 'onTabHeaderShown',
            'show': 'onDialogShow',
            'shown': 'onDialogShown',
            'hidden': 'onDialogHidden'
        },

        SignInView: Views.SignIn,
        ForgotPasswordView: Views.ForgotPassword,
        SignUpView: Views.SignUp,

        initialize: function() {
            this.signIn = new this.SignInView();
            this.forgotPassword = new this.ForgotPasswordView();
            this.signUp = new this.SignUpView();
            
            this.firstTab = this.$('a[data-toggle="tab"]').first();
            
            this.$el.modal({ show: false });

            this.listenTo(
                App.events,
                'showMembership',
                this.onShowMembership);
            
            this.listenTo(
                App.events,
                'signedIn passwordResetRequested signedUp',
                this.onSignedInOrPasswordResetRequestedOrSignedUp);
        },

        onShowMembership: function(e) {
            this.ok = (e && e.ok && _.isFunction(e.ok)) ? e.ok : void (0);
            this.cancel = (e && e.cancel && _.isFunction(e.cancel)) ? e.cancel : void (0);
            this.firstTab.trigger('click');
            this.$el.modal('show');
        },

        onSignedInOrPasswordResetRequestedOrSignedUp: function() {
            this.canceled = false;
            this.$el.modal('hide');
        },

        onTabHeaderShown: function(e) {
            var anchor = e.target;
            if (anchor && anchor.hash) {
                this.$(anchor.hash).putFocus();
            }
        },

        onDialogShow: function() {
            this.canceled = true;
            this.$el.resetFields()
                .hideSummaryError()
                .hideFieldErrors();
        },

        onDialogShown: function() {
            this.$el.putFocus();
        },

        onDialogHidden: function () {
            if (this.canceled && this.cancel) {
                this.cancel();
            } else {
                if (this.ok) {
                    this.ok();
                }
            }
        }
    });

})(_, Backbone, window.App || (window.App = {}));
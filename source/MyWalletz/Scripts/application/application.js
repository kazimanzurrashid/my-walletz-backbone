/* jshint browser: true, curly: true, eqeqeq: true, forin: true, latedef: true,
    newcap: true, noarg: true, noempty: true, nonew: true, strict:true,
    undef: true, unused: true */
/* global _: false, jQuery: false, Backbone: false */

(function ($, _, Backbone, App) {
    'use strict';

    function hasClientUrl() {
        var hash = window.location.hash;

        if (hash.length > App.clientUrlPrefix.length) {
            return true;
        }

        if (App.clientUrlPrefix.indexOf(hash) === 0) {
            return false;
        }

        return true;
    }

    function redirectToDefault() {
        App.router.navigate(clientUrl('/'), true);
    }

    function showInfobar(message) {
        _.delay(function() {
            $.showInfobar(message);
        }, 400);
    }
    
    function attachEventHandlers() {
        App.events.on('myAccount', function() {
            var eventName = App.context.isUserSignedIn() ?
                'showProfile' :
                'showMembership';
            App.events.trigger(eventName);
        });

        App.events.on('signedIn', function() {
            App.context.userSignedIn();
            showInfobar('You are now signed in.');
        });

        App.events.on('passwordResetRequested', function() {
            var message = 'An email with a password reset link has been ' +
                'sent to your email address. Please open the link to reset ' +
                'your password.';
            showInfobar(message);
        });

        App.events.on('signedUp', function() {
            var message = 'Thank you for signing up, an email with a ' +
                'confirmation link has been sent to your email address. ' +
                'Please open the link to activate your account.';
            showInfobar(message);
        });

        App.events.on('passwordChanged', function() {
            showInfobar('You have changed your password successfully.');
        });

        App.events.on('signedOut', function() {
            App.context.userSignedOut();
            redirectToDefault();
            showInfobar('You are now signed out.');
        });
    }
    
    function createViews() {
        App.membershipView = new App.Views.Membership();
        App.profileView = new App.Views.Profile();
    }
    
    function clientUrl() {
        var path = _.toArray(arguments).join('/');

        if (path.length && path.indexOf('/') === 0) {
            path = path.substring(1);
        }

        return App.clientUrlPrefix + path;
    }

    function start(options) {
        App.context = new App.Context(options);
        
        createViews();
        attachEventHandlers();
        
        App.router = new App.Router({
            context: App.context
        });

        Backbone.history.start();

        if (!hasClientUrl()) {
            redirectToDefault();
        }
    }

    App.clientUrl = clientUrl;
    App.start = start;

})(jQuery, _, Backbone, window.App || (window.App = {}));
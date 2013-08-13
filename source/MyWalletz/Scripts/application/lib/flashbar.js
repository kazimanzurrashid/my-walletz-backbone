/* jshint browser: true, curly: true, eqeqeq: true, forin: true, latedef: true,
    newcap: true, noarg: true, noempty: true, nonew: true, strict:true,
    undef: true, unused: true */
/* global _: false, jQuery: false */

(function($, _) {
    'use strict';

    $.flashbar = {
        defaults: {
            displayTimeout: 1000 * 5,
            slideDuration: 400
        }
    };

    var template = _(
            '<div class="alert alert-{{type}} fade.in flash-bar hide">' +
                '<button type="button" class="close" data-dismiss="alert" title="close">&times;</button>' +
                '<i class="{{icon}}"></i> ' +
                '<span>{{message}}</span>' +
            '</div>').template();

    $.showSuccessbar = function(message) {
        showFlashbar('success', message);
    };

    $.showErrorbar = function(message) {
        showFlashbar('error', message);
    };

    $.showInfobar = function(message) {
        showFlashbar('info', message);
    };

    function showFlashbar(type, message) {
        var lowerCasedType = type.toLowerCase(),
            icon,
            flashbar;

        if (lowerCasedType === 'success') {
            icon = 'icon-ok-sign';
        } else if (lowerCasedType === 'error') {
            icon = 'icon-warning-sign';
        } else if (lowerCasedType === 'info') {
            icon = 'icon-info-sign';
        } else {
            throw new Error('Unknown type.');
        }

        flashbar = $(template({
            type: lowerCasedType,
            icon: icon,
            message: message
        })).prependTo('body')
            .alert()
            .slideDown($.flashbar.defaults.slideDuration);

        _.delay(function() {
            flashbar.slideUp($.flashbar.defaults.slideDuration, function () {
                flashbar.remove();
            });
        }, $.flashbar.defaults.displayTimeout);
    }

    function removeExisting() {
        var flashbar = $('.flash-bar');
        _(function () {
            flashbar.slideUp($.flashbar.defaults.slideDuration,
                function () {
                    return flashbar.remove();
                });
        }).delay($.flashbar.defaults.displayTimeout);
    }

    $(function() {
        removeExisting();
    });

})(jQuery, _);
/* jshint browser: true, curly: true, eqeqeq: true, forin: true, latedef: true,
    newcap: true, noarg: true, noempty: true, nonew: true, strict:true,
    undef: true, unused: true */
/* global _: false, jQuery: false */

(function($, _) {
    'use strict';

    var SLIDE_DURATION = 400,
        DISPLAY_TIMEOUT = 1000 * 5;

    $.fn.serializeFields = function() {
        var container = $(this),
            fields = {};

        if (!container.is('form')) {
            container = container.find('form');
        }
        
        container.each(function() {
            $.each($(this).serializeArray(), function() {
                fields[this.name] = this.value;
            });
        });

        return fields;
    };

    $.fn.deserializeFields = function(attributes) {
        return this.each(function() {
            var self = this;
            _.chain(attributes).keys().each(function(key) {
                $(self).find(':input[name="' + key + '"]')
                    .val(attributes[key]);
            });
        });
    };

    $.fn.resetFields = function() {
        return this.each(function() {
            var container = $(this);
            if (container.is('form')) {
                container.get(0).reset();
                return;
            }

            container.find('form').each(function() {
                this.reset();
            });
        });
    };

    $.fn.putFocus = function() {
        var self = this;
        _.delay(function() {
            self.find(':input')
                .not(':button')
                .not(':disabled')
                .first()
                .select()
                .focus();
        }, 80);

        return this;
    };

    (function() {
        $.fn.hideFieldErrors = function (options) {
            var opts = $.extend({}, $.fn.hideFieldErrors.defaults, options);

            return this.each(function () {
                $(this).find('.control-group')
                    .filter('.error')
                    .removeClass('error')
                    .find('.help-block,.help-inline')
                    .slideUp(opts.slideDuration, function () {
                        $(this).remove();
                    });
            });
        };

        $.fn.hideFieldErrors.defaults = {
            slideDuration: SLIDE_DURATION
        };
    })();

    (function() {
        $.fn.showFieldErrors = function(options) {
            var self = this,
                opts = $.extend({}, $.fn.showFieldErrors.defaults, options),
                firstInput = null;

            this.each(function() {
                $(this).find(':input')
                    .each(function() {
                        var input = $(this),
                            inputName = input.attr('name'),
                            lowerCasedName;

                        if (!inputName) {
                            return;
                        }

                        lowerCasedName = inputName.toLocaleLowerCase();

                        _.chain(opts.errors)
                            .keys()
                            .filter(function(key) {
                                return opts.errors[key].length;
                            })
                            .filter(function(key) {
                                return key.toLowerCase() === lowerCasedName;
                            })
                            .each(function(key) {
                                var container;

                                if (!firstInput) {
                                    firstInput = input;
                                }

                                input.closest('.control-group').addClass('error');
                                container = opts.inline ?
                                    input.parent() :
                                    input.closest('.controls');

                                _.each(opts.errors[key], function(message) {
                                    $('<span>', {
                                        text: message,
                                        'class': opts.inline ?
                                            'help-inline' :
                                            'help-block'
                                    }).appendTo(container)
                                        .hide()
                                        .slideDown(opts.slideDuration);
                                });
                            });
                    });
            });

            if (firstInput) {
                firstInput.focus();
            }

            _.delay(function() {
                $(self).hideFieldErrors();
            }, opts.displayTimeout);

            return this;
        };

        $.fn.showFieldErrors.defaults = {
            slideDuration: SLIDE_DURATION,
            displayTimeout: DISPLAY_TIMEOUT,
            inline: false,
            errors: {}
        };
    })();

    (function() {
        $.fn.hideSummaryError = function(options) {
            var opts = $.extend({}, $.fn.hideSummaryError.defaults, options);

            return this.each(function() {
                var container = $(this);

                if (!container.is('form')) {
                    container = container.find('form');
                }

                container.find('.alert')
                    .slideUp(opts.slideDuration, function() {
                        $(this).remove();
                    });
            });
        };

        $.fn.hideSummaryError.defaults = {
            slideDuration: SLIDE_DURATION
        };
    })();

    (function() {
        var template = _(
            '<div class="alert alert-error fade in">' +
                '<button type="button" class="close" data-dismiss="alert" title="close">&times;</button>' +
                '<strong>Error!</strong> ' +
                '<span>{{message}}</span>' +
            '</div>').template();

        $.fn.showSummaryError = function(options) {
            var opts = $.extend({}, $.fn.showSummaryError.defaults, options);

            return this.each(function() {
                var self = this,
                    container = $(this);

                if (!container.is('form')) {
                    container = container.find('form');
                }

                $(template({
                    message: opts.message
                })).prependTo(container)
                    .hide()
                    .slideDown(opts.slideDuration);

                _.delay(function() {
                    $(self).hideSummaryError();
                }, opts.displayTimeout);
            });
        };

        $.fn.showSummaryError.defaults = {
            slideDuration: SLIDE_DURATION,
            displayTimeout: DISPLAY_TIMEOUT,
            message: 'An unexpected error has occurred while performing ' +
                'your last operation.'
        };
    })();

})(jQuery, _);
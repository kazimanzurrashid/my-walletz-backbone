/* jshint browser: true, curly: true, eqeqeq: true, forin: true, latedef: true,
    newcap: true, noarg: true, noempty: true, nonew: true, strict:true,
    undef: true, unused: true */
/* global _: false, jQuery: false */

(function($, _) {
    'use strict';

    var template = _(
        '<div class="modal fade hide">' +
            '<div class="modal-header">' +
                '<button type="button" class="close" title="close" data-dismiss="modal">&times;</button>' +
                '<h3>{{title}}</h3>' +
            '</div>' +
            '<div class="modal-body">{{prompt}}</div>' +
            '<div class="modal-footer">' +
                '<button type="button" class="btn">Ok</button>' +
                '<button type="button" class="btn btn-primary" data-dismiss="modal">Cancel</button>' +
            '</div>' +
        '</div>').template();

    $.confirm = function(options) {
        var opts = $.extend({}, $.confirm.defaults, options),
            dialog = $(template({
                title: opts.title,
                prompt: opts.prompt
            })).appendTo('body').modal({
                show: false
            }).on('click', '.modal-footer .btn', function (e) {
                if ($(e.currentTarget).is('.btn-primary')) {
                    opts.cancel();
                } else {
                    dialog.modal('hide');
                    opts.ok();
                }
            }).on('hidden', function () {
                dialog.remove();
            }).modal('show');
    };

    $.confirm.defaults = {
        title: 'Confirm',
        prompt: 'Are you sure you want to perform this action?',
        ok: $.noop,
        cancel: $.noop
    };

})(jQuery, _);
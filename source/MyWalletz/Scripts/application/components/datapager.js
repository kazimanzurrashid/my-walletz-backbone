/* jshint browser: true, curly: true, eqeqeq: true, forin: true, latedef: true,
    newcap: true, noarg: true, noempty: true, nonew: true, strict:true,
    undef: true, unused: true */
/* global _: false, jQuery: false, Backbone: false */

(function($, _, Backbone, App) {
    'use strict';

    var Components = App.Components || (App.Components = {});

    Components.DataPager = Backbone.View.extend({
        events: {
            'click.dataPager li:not(.active) a': 'handlePageChange'
        },

        initialize: function(options) {
            this.setTemplate(
                options,
                'navigationIconTemplate',
                '<li><a href="javascript;;" title="{{title}}"><i class="{{icon}}"></i></a></li>');

            this.setTemplate(
                options,
                'ellipsisTemplate',
                '<li class="disabled"><span>...</span></li>');

            this.setTemplate(
                options,
                'numericPageTemplate',
                '<li class={{active ? "active" : null}}><a href="javascript:;">{{text}}</a></li>');

            this.pagesToShow = (options && options.pagesToShow) || 5;
            this.showFirstAndLast = options && options.showFirstAndLast;

            if (this.collection) {
                this.listenTo(this.collection, 'reset', this.render);
            }
        },

        render: function() {
            if (!_.has(this.collection, 'pageIndex') ||
                !_.has(this.collection, 'pageCount')) {
                return this;
            }

            var pagesToShow = this.pagesToShow,
                pageable = this.collection,
                pageCount = pageable.pageCount,
                currentPage = pageable.pageIndex + 1,
                start = 1,
                reminder,
                end,
                list,
                i;

            if (currentPage > pagesToShow) {
                reminder = (currentPage % pagesToShow);

                start = reminder === 0 ?
                    currentPage - pagesToShow + 1 :
                    currentPage - reminder + 1;
            }

            end = Math.min(start + pagesToShow - 1, pageCount);

            list = $('<ul/>');

            if (start > 1) {
                if (this.showFirstAndLast) {
                    this.appendIcon(
                        list,
                        1,
                        'First page',
                        'icon-double-angle-left');
                }

                this.appendIcon(
                    list,
                    currentPage - 1,
                    'Previous page',
                    'icon-angle-left');

                this.appendEllipsis(list);
            }

            for (i = start; i <= end; i++) {
                this.appendNumber(list, i, (i === currentPage));
            }

            if (end < pageCount) {
                this.appendEllipsis(list);
                this.appendIcon(
                    list,
                    currentPage + 1,
                    'Next page',
                    'icon-angle-right');

                if (this.showFirstAndLast) {
                    this.appendIcon(
                        list,
                        pageCount,
                        'Last page',
                        'icon-double-angle-right');
                }
            }

            this.$el.empty().append(list);

            return this;
        },

        setColection: function(collection) {
            if (this.collection) {
                this.stopListening(this.collection, 'reset');
            }
            this.collection = collection;
            this.listenTo(this.collection, 'reset', this.render);
        },

        appendIcon: function(container, page, title, iconClass) {
            var el = this.createPage(this.navigationIconTemplate({
                title: title,
                icon: iconClass
            }), page);
            container.append(el);
        },

        appendEllipsis: function(container) {
            return container.append($(this.ellipsisTemplate()));
        },

        appendNumber: function(container, page, current, text) {
            var el;

            if (_.isUndefined(text)) {
                text = page.toString();
            }

            el = this.createPage(this.numericPageTemplate({
                text: text,
                active: current
            }), page, current);

            container.append(el);
        },

        createPage: function(html, page, current) {
            var el;

            if (_.isUndefined(current)) {
                current = false;
            }
            
            el = $(html);

            if (!current) {
                el.find('a').first().attr('data-page-no', page);
            }

            return el;
        },

        setTemplate: function(options, attribute, defaultTemplate) {
            var template;

            if (options && _.has(options, attribute)) {
                template = $(options[attribute]);
                if (template.length) {
                    this[attribute] = _.template(template.html());
                } else {
                    this[attribute] = _.template(options[attribute]);
                }
            } else {
                this[attribute] = _.template(defaultTemplate);
            }
        },

        handlePageChange: function(e) {
            var page, args;

            e.preventDefault();
            page = $(e.currentTarget).attr('data-page-no');

            if (!page) {
                return;
            }

            args = _.extend(e, {
                page: page
            });

            this.trigger('pageChanged', args);
        }
    });
})(jQuery, _, Backbone, window.App || (window.App = {}));
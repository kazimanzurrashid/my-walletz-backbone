var Application;

(function($, _, Backbone, Application) {
    var Components = Application.Components || (Application.Components = {});

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

            var pagesToShow = this.pagesToShow;
            var pageable = this.collection;
            var pageCount = pageable.pageCount;
            var currentPage = pageable.pageIndex + 1;
            var start = 1;

            if (currentPage > pagesToShow) {
                var reminder = (currentPage % pagesToShow);

                start = reminder === 0 ?
                    currentPage - pagesToShow + 1 :
                    currentPage - reminder + 1;
            }

            var end = Math.min(start + pagesToShow - 1, pageCount);

            var list = $('<ul/>');

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

            for (var i = start; i <= end; i++) {
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
            if (!text) {
                text = page.toString();
            }
            var el = this.createPage(this.numericPageTemplate({
                text: text,
                active: current
            }), page, current);

            container.append(el);
        },

        createPage: function(html, page, current) {
            if (typeof current === 'undefined') {
                current = false;
            }

            var el = $(html);

            if (!current) {
                el.find('a').first().attr('data-page-no', page);
            }

            return el;
        },

        setTemplate: function(options, attribute, defaultTemplate) {
            if (options && _.has(options, attribute)) {
                var template = $(options[attribute]);
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
            e.preventDefault();
            var page = $(e.currentTarget).attr('data-page-no');

            if (!page) {
                return;
            }

            var args = _.extend(e, {
                page: page
            });

            this.trigger('pageChanged', args);
        }
    });
})(jQuery, _, Backbone, Application || (Application = {}));
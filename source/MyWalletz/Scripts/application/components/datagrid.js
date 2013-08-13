/* jshint browser: true, curly: true, eqeqeq: true, forin: true, latedef: true,
    newcap: true, noarg: true, noempty: true, nonew: true, strict:true,
    undef: true, unused: true */
/* global _: false, jQuery: false, Backbone: false */

(function ($, _, Backbone, App) {
    'use strict';

    var Components = App.Components || (App.Components = {});

    Components.DataGridRow = Backbone.View.extend({
        tagName: 'tr',

        initialize: function(options) {
            this.template = options.template;
            this.destroyAnimation = options.destroyAnimation;
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy remove', this.remove);
        },

        render: function() {
            var args = {
                dataModel: this.model,
                viewModel: null,
                el: this.$el
            },
            model;

            this.trigger('render', args);
            model = args.viewModel || args.dataModel.toJSON();
            this.$el.html(this.template(model));

            return this;
        },

        remove: function (notify) {
            var self = this;

            if (_.isUndefined(notify)) {
                notify = true;
            }

            if (!notify) {
                Backbone.View.prototype.remove.call(this);
                return this;
            }

            this.trigger('removing');

            if (!_.isFunction(this.destroyAnimation)) {
                Backbone.View.prototype.remove.call(this);
                return this;
            }

            this.destroyAnimation(this.$el)
                .promise()
                .done(function () {
                    Backbone.View.prototype.remove.call(self);
                });

            return this;
        }
    });

    Components.DataGrid = Backbone.View.extend({
        events: {
            'click.dataGrid .data-grid-header th:not(.data-grid-unsortable)': 'handleSort',
            'click.dataGrid .data-grid-content [data-command]': 'handleCommand'
        },

        initialize: function(options) {
            var template;

            if (_.isString(options.rowTemplate)) {
                template = $(options.rowTemplate);

                if (template.length) {
                    this.rowTemplate = _.template(template.html());
                } else {
                    this.rowTemplate = _.template(options.rowTemplate);
                }
            } else {
                this.rowTemplate = options.rowTemplate;
            }

            this.rowInsertMode = options.rowInsertMode ||
                Components.DomInsertMode.append;

            this.createAnimation = options.createAnimation || function(el) {
                return el.slideDown();
            };

            this.destroyAnimation = options.destroyAnimation || function(el) {
                return el.slideUp();
            };

            this.columnHeaders = this.$('.data-grid-header th:not(.data-grid-unsortable)');
            this.rowContainer = this.$('.data-grid-content');
            this.subscribeCollectionEvents();
            this.dataRows = [];
        },

        render: function() {
            var self = this;

            this.configureSort();
            this.removeRows();

            this.collection
                .each(function(model) {
                    self.renderRow(model, false);
                });

            if (this.dataRows.length) {
                var fragment = document.createDocumentFragment();

                _.each(this.dataRows, function(row) {
                    return fragment.appendChild(row.el);
                });

                this.rowContainer.append(fragment);
            }

            return this;
        },

        remove: function() {
            this.removeRows();
            Backbone.View.prototype.remove.call(this, arguments);
            return this;
        },

        setColection: function(collection) {
            this.unsubscribeCollectionEvents();
            this.collection = collection;
            this.subscribeCollectionEvents();
        },

        removeRows: function() {
            var self = this;
            _.each(this.dataRows, function(row) {
                self.stopListening(row);
                row.remove(false);
            });
            this.dataRows = [];
            this.rowContainer.empty();
        },

        configureSort: function() {
            var sortable = this.collection,
                sortAttribute,
                icon;

            this.columnHeaders
                .removeClass('data-grid-sorted')
                .find('i').remove();

            if (!sortable.sortAttribute) {
                return;
            }

            sortAttribute = sortable.sortAttribute.toLowerCase();
            icon = sortable.sortOrder === Components.SortOrder.descending ?
                'icon-chevron-down' :
                'icon-chevron-up';

            this.columnHeaders.each(function(index, element) {
                var column = $(element),
                    columnName = column.attr('data-attribute') || '';

                if (sortAttribute === columnName.toLowerCase()) {
                    column.addClass('data-grid-sorted')
                        .append($('<i>').addClass(icon));
                }
            });
        },

        renderRow: function(model, insertInDom) {
            var row = new Components.DataGridRow({
                model: model,
                template: this.rowTemplate,
                destroyAnimation: this.destroyAnimation
            }),
            self = this;

            if (_.isUndefined(insertInDom)) {
                insertInDom = true;
            }

            this.listenTo(row, 'render', function(e) {
                return self.trigger('rowRender', e);
            });

            this.listenTo(row, 'removing', function() {
                var index = _.indexOf(self.dataRows, row);
                self.stopListening(row);
                self.dataRows.splice(index, 1);
            });

            row.render()
                .$el
                .attr('data-cid', model.cid);

            if (insertInDom) {
                row.$el.hide();
                if (this.rowInsertMode === Components.DomInsertMode.append) {
                    row.$el.appendTo(this.rowContainer);
                } else if (this.rowInsertMode === Components.DomInsertMode.prepend) {
                    row.$el.prependTo(this.rowContainer);
                }
                this.createAnimation(row.$el);
            }

            this.dataRows.push(row);

            return row;
        },

        subscribeCollectionEvents: function() {
            if (!this.collection) {
                return;
            }
            this.listenTo(this.collection, 'add', this.renderRow);
            this.listenTo(this.collection, 'reset sort', this.render);
        },

        unsubscribeCollectionEvents: function() {
            if (!this.collection) {
                return;
            }
            this.stopListening(this.collection, 'add reset sort');
        },

        handleSort: function(e) {
            var sortable = this.collection,
                existingSortAttribute = sortable.sortAttribute || '',
                newSortAttribute = $(e.currentTarget).attr('data-attribute') || '',
                order = Components.SortOrder.ascending,
                args;

            if (!existingSortAttribute && !newSortAttribute) {
                return;
            }

            if ((existingSortAttribute.toLowerCase() === newSortAttribute.toLowerCase()) &&
                (sortable.sortOrder === Components.SortOrder.ascending)) {
                order = Components.SortOrder.descending;
            }

            args = _.extend(e, {
                attribute: newSortAttribute,
                order: order
            });

            this.trigger('sort', args);
        },

        handleCommand: function (e) {
            var element = $(e.currentTarget),
                command = element.attr('data-command'),
                cid = element.closest('[data-cid]').attr('data-cid'),
                model = this.collection.get(cid),
                args = _.extend(e, {
                    command: command,
                    model: model
                });
            this.trigger('command', args);
        }
    });
})(jQuery, _, Backbone, window.App || (window.App = {}));
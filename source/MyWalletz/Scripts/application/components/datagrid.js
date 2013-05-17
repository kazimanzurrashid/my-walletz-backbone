var Application;

(function ($, _, Backbone, Application) {
    var Components = Application.Components || (Application.Components = {});

    Components.DataGridRow = Backbone.View.extend({
        tagName: 'tr',

        initialize: function(options) {
            this.template = options.template;
            this.destroyAnimation = options.destroyAnimation;
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },

        render: function() {
            var args = {
                dataModel: this.model,
                viewModel: null,
                el: this.$el
            };

            this.trigger('render', args);
            var model = args.viewModel || args.dataModel.toJSON();
            this.$el.html(this.template(model));

            return this;
        },

        remove: function(notify) {
            if (typeof notify === 'undefined') {
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

            var self = this;

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
            if (_.isString(options.rowTemplate)) {
                var template = $(options.rowTemplate);
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
            this.configureSort();
            this.removeRows();

            var self = this;

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
            this.unsubscribeCollectionEvents();
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
            this.columnHeaders
                .removeClass('data-grid-sorted')
                .find('i').remove();

            var sortable = this.collection;

            if (!sortable.sortAttribute) {
                return;
            }

            var sortAttribute = sortable.sortAttribute.toLowerCase();
            var icon = sortable.sortOrder === Components.SortOrder.descending ?
                'icon-chevron-down' :
                'icon-chevron-up';

            this.columnHeaders.each(function(index, element) {
                var column = $(element);
                var columnName = column.attr('data-attribute') || '';

                if (sortAttribute === columnName.toLowerCase()) {
                    column.addClass('data-grid-sorted')
                        .append($('<i>').addClass(icon));
                }
            });
        },

        renderRow: function(model, insertInDom) {
            if (typeof insertInDom === 'undefined') {
                insertInDom = true;
            }

            var row = new Components.DataGridRow({
                model: model,
                template: this.rowTemplate,
                destroyAnimation: this.destroyAnimation
            });

            var self = this;

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
            var sortable = this.collection;
            var existingSortAttribute = sortable.sortAttribute || '';
            var newSortAttribute = $(e.currentTarget).attr('data-attribute') || '';
            var order = Components.SortOrder.ascending;

            if (!existingSortAttribute && !newSortAttribute) {
                return;
            }

            if ((existingSortAttribute.toLowerCase() === newSortAttribute.toLowerCase()) &&
                (sortable.sortOrder == Components.SortOrder.ascending)) {
                order = Components.SortOrder.descending;
            }

            var args = _.extend(e, {
                attribute: newSortAttribute,
                order: order
            });

            this.trigger('sort', args);
        },

        handleCommand: function (e) {
            var element = $(e.currentTarget);
            var command = element.attr('data-command');
            var cid = element.closest('[data-cid]').attr('data-cid');
            var model = this.collection.get(cid);
            var args = _.extend(e, {
                command: command,
                model: model
            });
            this.trigger('command', args);
        }
    });
})(jQuery, _, Backbone, Application || (Application = {}));
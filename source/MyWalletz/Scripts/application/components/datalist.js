var Application;

(function($, _, Backbone, Application) {
    var Components = Application.Components || (Application.Components = {});

    Components.DataList = Backbone.View.extend({
        events: {
            'click.dataList [data-command]': 'handleCommand'
        },

        initialize: function(options) {
            this.childViewFactory = options.childViewFactory;

            if (_.has(options, 'childViewContainer')) {
                if (_.isString(options.childViewContainer)) {
                    this.childViewContainer = this.$(options.childViewContainer);
                    if (!this.childViewContainer.length) {
                        this.childViewContainer = $(options.childViewContainer);
                    }
                } else {
                    if (_.isElement(options.childViewContainer)) {
                        this.childViewContainer = $(options.childViewContainer);
                    } else {
                        this.childViewContainer = options.childViewContainer;
                    }
                }
            } else {
                this.childViewContainer = this.$el;
            }

            this.itemInsertMode = options.itemInsertMode ||
                Components.DomInsertMode.append;
            this.subscribeCollectionEvents();
            this.childViews = [];
        },

        render: function() {
            this.removeChildViews();

            var self = this;

            this.collection
                .each(function (model) {
                    self.renderChildView(model, false);
                });

            if (this.childViews.length) {
                var fragment = document.createDocumentFragment();
                _.each(this.childViews, function(v) {
                    return fragment.appendChild(v.el);
                });
                this.childViewContainer.append(fragment);
            }

            return this;
        },

        remove: function() {
            this.removeChildViews();
            Backbone.View.prototype.remove.call(this, arguments);
            return this;
        },

        setColection: function(collection) {
            this.unsubscribeCollectionEvents();
            this.collection = collection;
            this.subscribeCollectionEvents();
            return this;
        },

        subscribeCollectionEvents: function() {
            if (!this.collection) {
                return;
            }
            this.listenTo(this.collection, 'sort reset', this.render);
            this.listenTo(this.collection, 'add', this.renderChildView);
        },

        unsubscribeCollectionEvents: function() {
            if (!this.collection) {
                return;
            }
            this.stopListening(this.collection, 'sort reset add');
        },

        removeChildViews: function() {
            var self = this;
            _.each(this.childViews, function(view) {
                self.stopListening(view);
                view.remove();
            });
            this.childViews = [];
            this.childViewContainer.empty();
        },

        renderChildView: function(model, includeInDom) {
            if (typeof includeInDom === 'undefined') {
                includeInDom = true;
            }

            var childView = this.childViewFactory(model);
            var self = this;

            this.listenTo(childView, 'removing', function() {
                var index = _.indexOf(self.childViews, childView);
                self.stopListening(childView);
                self.childViews.splice(index, 1);
            });

            childView.render()
                .$el
                .attr('data-cid', model.cid);

            if (includeInDom) {
                if (this.itemInsertMode === Components.DomInsertMode.append) {
                    this.childViewContainer.append(childView.$el);
                } else if (this.itemInsertMode === Components.DomInsertMode.prepend) {
                    this.childViewContainer.prepend(childView.$el);
                }
            }

            this.childViews.push(childView);

            return childView;
        },

        handleCommand: function(e) {
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
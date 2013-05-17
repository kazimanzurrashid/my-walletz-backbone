var Application;

(function($, Backbone, Application) {
    var Views = Application.Views || (Application.Views = {});

    Views.AccountMenuItem = Backbone.View.extend({
        tagName: 'li',

        initialize: function() {
            this.listenTo(this.model, 'change:title', this.render);
            this.listenTo(this.model, 'remove destroy', this.remove);
        },

        render: function() {
            var html = '<a href="' +
                Application.clientUrl(
                    '/accounts',
                    this.model.id,
                    'transactions') +
                '">' +
                this.model.get('title') + '</a>';

            this.$el.html(html);

            return this;
        },

        remove: function() {
            this.trigger('removing');
            Backbone.View.prototype.remove.call(this, arguments);
            return this;
        }
    });

    Views.Navigation = Backbone.View.extend({
        el: '#navigation',

        events: {
            'click [data-command]': 'handleCommand'
        },

        initialize: function() {
            this.dataList = new Application.Components.DataList({
                el: this.$('.transactions-menu > .dropdown-menu'),
                childViewFactory: function(model) {
                    return new Views.AccountMenuItem({
                        model: model
                    });
                },
                collection: this.collection
            });
        },

        render: function() {
            this.dataList.render();
            return this;
        },

        select: function(menu) {
            return this.deselectAll().filter('.' + menu).addClass('active');
        },

        deselectAll: function() {
            return this.$('.nav > li').removeClass('active');
        },

        handleCommand: function(e) {
            var command = $(e.currentTarget).attr('data-command');

            if (command) {
                Application.events.trigger(command);
            }
        }
    });

})(jQuery, Backbone, Application || (Application = {}));
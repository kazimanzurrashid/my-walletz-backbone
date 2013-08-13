/* jshint browser: true, curly: true, eqeqeq: true, forin: true, latedef: true,
    newcap: true, noarg: true, noempty: true, nonew: true, strict:true,
    undef: true, unused: true */
/* global _: false, Backbone: false */

(function (_, Backbone, App) {
    'use strict';

    var Views = App.Views || (App.Views = {});

    Views.Page = Backbone.View.extend({
        initialize: function(options) {
            this.template = options.template;
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    _.extend(Views.Page.prototype, Views.Activable);

})(_, Backbone, window.App || (window.App = {}));
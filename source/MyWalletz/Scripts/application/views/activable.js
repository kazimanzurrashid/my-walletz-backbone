/* jshint browser: true, curly: true, eqeqeq: true, forin: true, latedef: true,
    newcap: true, noarg: true, noempty: true, nonew: true, strict:true,
    undef: true, unused: true */
/* global _: false */

(function (_, App) {
    'use strict';

    var Views = App.Views || (App.Views = {});

    Views.Activable = {
        activate: function() {
            var self = this,
                el = this.$el;

            this.clearAnimationTimer();
            this.animationTimer = _.defer(function() {
                el.show()
                    .css({ marginLeft: el.outerWidth() })
                    .hide()
                    .show(function() {
                        el.animate({ marginLeft: 0 }, 400, function() {
                            self.animationTimer = void(0);
                            if (_.isFunction(self.onActivate)) {
                                self.onActivate();
                            }
                        });
                    });
            });
        },

        deactivate: function() {
            if (_.isFunction(this.onDeactivate)) {
                this.onDeactivate();
            }
            this.$el.hide();
            this.clearAnimationTimer();
        },

        clearAnimationTimer: function() {
            if (this.animationTimer) {
                clearTimeout(this.animationTimer);
                this.animationTimer = void(0);
            }
        }
    };

})(_, window.App || (window.App = {}));
/* jshint browser: true, curly: true, eqeqeq: true, forin: true, latedef: true,
    newcap: true, noarg: true, noempty: true, nonew: true, strict:true,
    undef: true, unused: true */
/* global _: false */

(function (_, App) {
    'use strict';

    var Components = App.Components || (App.Components = {});
    
    Components.SortOrder = {
        ascending: 0,
        descending: 1
    };

    Components.Sortable = _.extend({}, {
        resetSorting: function () {
            this.sortAttribute = this.defaultSortAttribute;
            this.sortOrder = this.defaultSortOrder;

            return this;
        },

        comparator: function (model1, model2) {
            var sortAttribute = this.sortAttribute ||
                _.chain(model1.attributes).keys().first().value(),
                sortOrder = this.sortOrder || Components.SortOrder.ascending,
                attribute1 = model1.get(sortAttribute),
                attribute2 = model2.get(sortAttribute),
                result = 0;

            if (attribute1 > attribute2) {
                result = 1;
            } else {
                if (attribute1 < attribute2) {
                    result = -1;
                }
            }

            if ((result !== 0) &&
                (sortOrder === Components.SortOrder.descending)) {
                result = -result;
            }

            return result;
        }
    });
})(_, window.App || (window.App = {}));
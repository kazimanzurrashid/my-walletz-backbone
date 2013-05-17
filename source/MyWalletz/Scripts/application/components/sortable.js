var Application;

(function (_, Application) {
    var Components = Application.Components || (Application.Components = {});
    
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
                _.chain(model1.attributes).keys().first().value();
            var sortOrder = this.sortOrder || Components.SortOrder.ascending;
            var attribute1 = model1.get(sortAttribute);
            var attribute2 = model2.get(sortAttribute);
            var result = 0;

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
})(_, Application || (Application = {}));
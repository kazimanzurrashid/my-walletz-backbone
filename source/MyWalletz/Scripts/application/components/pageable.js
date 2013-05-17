var Application;

(function ($, _, Backbone, Application) {
    var Components = Application.Components || (Application.Components = {});
    
    Components.Pageable = _.extend({}, {
        parse: function (resp) {
            this.setCounts(resp[this.countAttribute]);
            return resp[this.resultAttribute];
        },

        fetch: function (options) {
            options || (options = {});

            var query = {
                top: this.pageSize
            };

            if (this.pageIndex) {
                query.skip = this.pageSize * this.pageIndex;
            }

            if (this.sortAttribute) {
                var orderBy = this.sortAttribute;

                if (this.sortOrder === Components.SortOrder.ascending) {
                    orderBy += ' asc';
                } else {
                    if (this.sortOrder === Components.SortOrder.descending) {
                        orderBy += ' desc';
                    }
                }
                query.orderBy = orderBy;
            }

            options.url = _.result(this, 'url') + '?' + $.param(query);

            return Backbone.Collection.prototype.fetch.call(this, options);
        },

        setCounts: function (count) {
            this.totalCount = count;
            this.pageCount = Math.ceil(count / this.pageSize);
            return this;
        },

        resetPaging: function () {
            this.resetSorting();
            this.pageSize = this.defaultPageSize;
            this.pageIndex = 0;
            this.pageCount = 0;
            this.totalCount = 0;

            return this;
        }
    }, Components.Sortable);

})(jQuery, _, Backbone, Application || (Application = {}));
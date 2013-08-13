/* jshint browser: true, curly: true, eqeqeq: true, forin: true, latedef: true,
    newcap: true, noarg: true, noempty: true, nonew: true, strict:true,
    undef: true, unused: true */
/* global _: false, jQuery: false, Backbone: false */

(function ($, _, Backbone, App) {
    'use strict';

    var Components = App.Components || (App.Components = {});

    Components.Pageable = _.extend({}, {
        parse: function (resp) {
            this.setCounts(resp[this.countAttribute]);
            return resp[this.resultAttribute];
        },

        fetch: function (options) {
            var query = {
                top: this.pageSize
            },
            orderBy;

            if (!options) {
                options = {};
            }
            
            if (this.pageIndex) {
                query.skip = this.pageSize * this.pageIndex;
            }

            if (this.sortAttribute) {
                orderBy = this.sortAttribute;

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

})(jQuery, _, Backbone, window.App || (window.App = {}));
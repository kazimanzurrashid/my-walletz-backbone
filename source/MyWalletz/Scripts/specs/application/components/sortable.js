var expect = chai.expect;

describe('Components.Sortable', function() {
    var sortable;

    beforeEach(function() {
        sortable = _.extend({}, App.Components.Sortable);
    });

    describe('#resetSorting', function() {
        beforeEach(function() {
            sortable.defaultSortAttribute = 'pages';
            sortable.defaultSortOrder = App.Components
                .SortOrder.descending;
            sortable.sortAttribute = 'title';
            sortable.sortOrder = App.Components
                .SortOrder.ascending;
            sortable.resetSorting();
        });

        it('resets #sortAttribute to default', function() {
            expect(sortable.sortAttribute).to.equal('pages');
        });

        it('resets #sortOrder to default', function() {
            expect(sortable.sortOrder)
                .to.equal(App.Components.SortOrder.descending);
        });
    });

    describe('#comparator', function() {
        var model1;
        var model2;
        var result;

        beforeEach(function() {
            sortable.sortAttribute = 'foo';
            model1 = new DummyModel();
            model2 = new DummyModel();
            result = null;
        });

        describe('greater than', function() {
            beforeEach(function() {
                model1.set('foo', 'Test2');
                model2.set('foo', 'Test1');
            });

            describe('ascending', function() {
                beforeEach(function() {
                    sortable.sortOrder = App.Components
                        .SortOrder.ascending;
                    result = sortable.comparator(model1, model2);
                });

                it('returns positive 1', function() {
                    expect(result).to.equal(1);
                });
            });

            describe('descending', function() {
                beforeEach(function() {
                    sortable.sortOrder = App.Components
                        .SortOrder.descending;
                    result = sortable.comparator(model1, model2);
                });

                it('returns negative 1', function() {
                    expect(result).to.equal(-1);
                });
            });
        });

        describe('less than', function() {
            beforeEach(function() {
                model1.set('foo', 'Test1');
                model2.set('foo', 'Test2');
            });

            describe('ascending', function() {
                beforeEach(function() {
                    sortable.sortOrder = App.Components
                        .SortOrder.ascending;
                    result = sortable.comparator(model1, model2);
                });

                it('returns negative 1', function() {
                    expect(result).to.equal(-1);
                });
            });

            describe('descending', function() {
                beforeEach(function() {
                    sortable.sortOrder = App.Components
                        .SortOrder.descending;
                    result = sortable.comparator(model1, model2);
                });

                it('returns positive 1', function() {
                    expect(result).to.equal(1);
                });
            });
        });

        describe('equal', function() {
            beforeEach(function() {
                model1.set('foo', 'Test');
                model2.set('foo', 'Test');
            });

            describe('ascending', function() {
                beforeEach(function() {
                    sortable.sortOrder = App.Components
                        .SortOrder.ascending;
                    result = sortable.comparator(model1, model2);
                });

                it('returns 0', function() {
                    expect(result).to.equal(0);
                });
            });

            describe('descending', function() {
                beforeEach(function() {
                    sortable.sortOrder = App.Components
                        .SortOrder.descending;
                    result = sortable.comparator(model1, model2);
                });

                it('returns 0', function() {
                    expect(result).to.equal(0);
                });
            });
        });
    });
});
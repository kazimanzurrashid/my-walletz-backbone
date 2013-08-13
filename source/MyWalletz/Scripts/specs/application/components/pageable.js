var expect = chai.expect;

describe('Components.Pageable', function() {
    var pageable;

    beforeEach(function() {
        pageable = _.extend({}, App.Components.Pageable);
    });

    describe('#resetPaging', function() {
        beforeEach(function() {
            pageable.defaultPageSize = 10;
            pageable.pageSize = 25;
            pageable.pageIndex = 1;
            pageable.pageCount = 4;
            pageable.totalCount = 100;
            pageable.resetPaging();
        });

        it('resets #pageSize to default', function() {
            expect(pageable.pageSize).to.equal(10);
        });

        it('resets #pageIndex to default', function() {
            expect(pageable.pageIndex).to.equal(0);
        });

        it('resets #pageCount to default', function() {
            expect(pageable.pageCount).to.equal(0);
        });

        it('resets #totalCount to default', function() {
            expect(pageable.totalCount).to.equal(0);
        });
    });

    describe('#parse', function() {
        var input, output;

        beforeEach(function() {
            pageable.countAttribute = 'count';
            pageable.resultAttribute = 'data';
            pageable.pageSize = 25;
            input = {
                count: 56,
                data: []
            };
            output = pageable.parse(input);
        });

        it('returns data', function() {
            expect(output).to.equal(input.data);
        });

        it('sets #totalCount', function() {
            expect(pageable.totalCount).to.equal(56);
        });

        it('sets #pageCount', function() {
            expect(pageable.pageCount).to.equal(3);
        });
    });

    describe('#fetch', function() {
        var fetchStub;
        var options;

        before(function() {
            return fetchStub = sinon.stub(
                Backbone.Collection.prototype,
                'fetch',
                function() {
                });
        });

        beforeEach(function() {
            pageable.pageIndex = 3;
            pageable.pageSize = 10;
            pageable.sortAttribute = 'title';
            pageable.sortOrder = App.Components.SortOrder.descending;
            pageable.url = function() {
                return '/endpoint';
            };
            options = {
                url: ''
            };
            pageable.fetch(options);
        });

        it('has top in url', function() {
            expect(options.url).to.contain('top=10');
        });

        it('has skip in url', function() {
            expect(options.url).to.contain('skip=30');
        });

        it('has orderBy in url', function() {
            expect(options.url).to.contain('orderBy=title+desc');
        });

        after(function() {
            fetchStub.restore();
        });
    });
});
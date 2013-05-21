var expect = chai.expect;

describe('Views.CategoryTabbedList', function () {
    var stubbedCategoryList;
    var stubbedSelector;
    var stubbedListenTo;
    var collection;
    var view;

    before(function() {
        fixtures.set('<div id=\"category-list-page\"></div>');

        stubbedCategoryList = sinon.stub(
            Application.Views,
            'CategoryList',
            function() {
                return {
                    render: function() {
                        return this;
                    }
                };
            });

        stubbedSelector = sinon.stub(
            Application.Views.CategoryTabbedList.prototype,
            '$',
            function() {
                return {
                    html: function() {
                        return '<div></div>';
                    }
                };
            });

        stubbedListenTo = sinon.stub(
            Application.Views.CategoryTabbedList.prototype,
            'listenTo',
            function() {
            });

        collection = new Application.Models.Categories();

        view = new Application.Views.CategoryTabbedList({
            el: $(fixtures.window().document.body).find('#category-list-page'),
            collection: collection
        });
    });

    describe('new', function() {
        it('creates expense list view', function() {
            expect(view.expenseList).to.exist;
        });

        it('creates income list view', function() {
            expect(view.incomesList).to.exist;
        });

        it('subscribes to collection reset event', function() {
            expect(stubbedListenTo)
                .to.have.been.calledWith(
                    collection,
                    'reset',
                    sinon.match.func);
        });
    });

    describe('#render', function() {
        var spiedExpenseRender;
        var spiedIncomeListRender;

        before(function() {
            spiedExpenseRender = sinon.spy(view.expenseList, 'render');
            spiedIncomeListRender = sinon.spy(view.incomesList, 'render');

            view.render();
        });

        it('renders expense list view', function () {
            expect(spiedExpenseRender).to.have.been.calledOnce;
        });

        it('renders income list view', function () {
            expect(spiedIncomeListRender).to.have.been.calledOnce;
        });

        after(function() {
            spiedExpenseRender.restore();
            spiedIncomeListRender.restore();
        });
    });

    after(function () {
        stubbedSelector.restore();
        stubbedListenTo.restore();
        stubbedCategoryList.restore();
        fixtures.cleanUp();
    });
});
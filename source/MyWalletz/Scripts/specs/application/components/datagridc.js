var expect = chai.expect;

describe('Components.DataGridRow', function() {
    var model;
    var row;

    beforeEach(function() {
        model = new DummyModel({
            foo: 'baz',
            bar: 'qux'
        });
        row = new Application.Components.DataGridRow({
            template: _.template('<td>{{foo}}</td><td>{{bar}}</td>'),
            model: model
        });
    });

    describe('#render', function() {
        var rendered;

        beforeEach(function() {
            rendered = false;
            row.on('render', function() {
                rendered = true;
            });
            row.render();
        });

        it('el is html table row', function() {
            expect(row.el.tagName.toLowerCase()).to.equal('tr');
        });

        it('contains model attributes', function() {
            var html = row.$el.html();
            expect(html).to.contain(model.get('foo'));
            expect(html).to.contain(model.get('bar'));
        });

        it('triggers render event', function() {
            expect(rendered).to.be.true;
        });
    });

    describe('#remove', function() {
        var animated;

        beforeEach(function() {
            animated = false;
            row.destroyAnimation = function(el) {
                animated = true;
                return el;
            };
            row.render();
        });

        describe('notifies parent', function() {
            beforeEach(function() {
                row.remove();
            });

            it('also animates destroy animation', function() {
                expect(animated).to.be.true;
            });
        });

        describe('no parent notification', function() {
            beforeEach(function() {
                row.remove(false);
            });

            it('does not animate', function() {
                expect(animated).to.be.false;
            });
        });
    });
});

describe('Components.DataGrid', function() {
    var dataGrid;
    var el;

    before(function() {
        fixtures.load('/components/datagrid.html');
        el = $(fixtures.window().document.body).find('#grid');
    });

    beforeEach(function() {
        dataGrid = new Application.Components.DataGrid({
            el: el,
            rowTemplate: '#grid-row-template'
        });
    });

    describe('#constructor', function() {
        it('sets #rowTemplate', function() {
            expect(dataGrid.rowTemplate).to.be.a('function');
        });

        it('sets #rowInsertMode', function() {
            expect(dataGrid.rowInsertMode)
                .to.equal(Application.Components.DomInsertMode.append);
        });

        it('sets #createAnimation', function() {
            expect(dataGrid.createAnimation).to.be.a('function');
        });

        it('sets #destroyAnimation', function() {
            expect(dataGrid.destroyAnimation).to.be.a('function');
        });

        it('sets #columnHeaders', function() {
            expect(dataGrid.columnHeaders).to.exist;
        });

        it('sets #rowContainer', function() {
            expect(dataGrid.rowContainer).to.exist;
        });

        it('initializes #dataRows', function() {
            expect(dataGrid.dataRows).to.be.empty;
        });
    });

    describe('#setColection', function() {

        describe('first time', function() {
            var spiedlistenTo;
            var collection;

            beforeEach(function() {
                spiedlistenTo = sinon.spy(dataGrid, 'listenTo');
                collection = new Backbone.Collection();
                dataGrid.setColection(collection);
            });

            it('subscribes to collection events', function() {
                expect(spiedlistenTo).to.have.been.calledWith(
                    collection,
                    'add',
                    dataGrid.renderRow);

                expect(spiedlistenTo).to.have.been.calledWith(
                    collection,
                    'reset sort',
                    dataGrid.render);
            });

            afterEach(function() {
                spiedlistenTo.restore();
            });
        });

        describe('consequent times', function() {
            var spiedStopListening;
            var collection;

            beforeEach(function() {
                spiedStopListening = sinon.spy(dataGrid, 'stopListening');
                collection = new Backbone.Collection();
                dataGrid.setColection(collection);
                dataGrid.setColection(new Backbone.Collection());
            });

            it('unsubscribes previous collection events', function() {
                expect(spiedStopListening).to.have.been.calledWith(
                    collection,
                    'add reset sort');
            });

            afterEach(function() {
                spiedStopListening.restore();
            });
        });
    });

    describe('#remove', function() {
        var spiedUnsubscribeCollectionEvents;
        var spiedRemoveRows;

        beforeEach(function() {
            spiedUnsubscribeCollectionEvents = sinon.spy(
                dataGrid,
                'unsubscribeCollectionEvents');
            spiedRemoveRows = sinon.spy(dataGrid, 'removeRows');
            dataGrid.remove();
        });

        it('unsubscribes collection events', function() {
            expect(spiedUnsubscribeCollectionEvents).to.have.been.calledOnce;
        });

        it('removes existing rows', function() {
            expect(spiedRemoveRows).to.have.been.calledOnce;
        });

        afterEach(function() {
            spiedUnsubscribeCollectionEvents.restore();
            spiedRemoveRows.restore();
        });
    });

    describe('#render', function() {
        var collection;
        var spiedConfigureSort;
        var spiedRemoveRows;

        beforeEach(function() {
            spiedConfigureSort = sinon.spy(dataGrid, 'configureSort');
            spiedRemoveRows = sinon.spy(dataGrid, 'removeRows');

            collection = new DummyModels([
                new DummyModel({
                    foo: 'foo1',
                    bar: 'bar1'
                }),
                new DummyModel({
                    foo: 'foo2',
                    bar: 'bar2'
                })
            ]);
            dataGrid.setColection(collection);
            dataGrid.render();
        });

        it('configures column sorting', function() {
            expect(spiedConfigureSort).to.have.been.calledOnce;
        });

        it('removes existing rows', function() {
            expect(spiedRemoveRows).to.have.been.calledOnce;
        });

        it('renders the same number of rows as in the collection', function() {
            expect(dataGrid.rowContainer.children().length)
                .to.equal(collection.length);
        });

        afterEach(function() {
            spiedConfigureSort.restore();
            spiedRemoveRows.restore();
        });
    });

    after(function() {
        fixtures.cleanUp();
    });
});
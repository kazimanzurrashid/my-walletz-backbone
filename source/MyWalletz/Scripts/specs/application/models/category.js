var expect = chai.expect;

describe('Models.Category', function() {
    var category;

    beforeEach(function() {
        category = new Application.Models.Category();
    });

    describe('#defaults', function() {
        it('has title', function() {
            expect(category.defaults()).to.have.property('title');
        });

        it('has type', function() {
            expect(category.defaults()).to.have.property('type');
        });
    });

    describe('#isExpense', function() {
        describe('expense', function() {
            beforeEach(function() {
                category.set({
                    type: Application.Models.CategoryType.expense
                });
            });

            it('returns true', function() {
                expect(category.isExpense()).to.be.true;
            });
        });

        describe('not expense', function() {
            it('returns false', function() {
                expect(category.isExpense()).to.not.be.ok;
            });
        });
    });

    describe('#isIncome', function() {
        describe('income', function() {
            beforeEach(function() {
                category.set({
                    type: Application.Models.CategoryType.income
                });
            });

            it('returns true', function() {
                expect(category.isIncome()).to.be.true;
            });
        });

        describe('not income', function() {
            it('returns false', function() {
                expect(category.isIncome()).to.not.be.ok;
            });
        });
    });

    describe('validation', function() {

        describe('valid', function() {
            beforeEach(function() {
                category.set({
                    title: 'automobiles',
                    type: Application.Models.CategoryType.expense
                });
            });

            it('is ok', function() {
                expect(category.isValid()).to.be.ok;
            });
        });

        describe('invalid', function() {

            describe('title', function() {

                describe('missing', function() {
                    beforeEach(function() {
                        category.set({
                            type: Application.Models.CategoryType.expense
                        });
                    });

                    it('is invalid', function() {
                        expect(category.isValid()).to.not.be.ok;
                        expect(category.validationError)
                            .to.have.property('title');
                    });
                });

                describe('blank', function() {
                    beforeEach(function() {
                        category.set({
                            title: '',
                            type: Application.Models.CategoryType.expense
                        });
                    });

                    it('is invalid', function() {
                        expect(category.isValid()).to.not.be.ok;
                        expect(category.validationError)
                            .to.have.property('title');
                    });
                });
            });

            describe('type', function() {

                describe('missing', function() {
                    beforeEach(function() {
                        category.set({
                            title: 'automobiles'
                        });
                    });

                    it('is invalid', function() {
                        expect(category.isValid()).to.not.be.ok;
                        expect(category.validationError)
                            .to.have.property('type');
                    });
                });

                describe('blank', function() {
                    beforeEach(function() {
                        category.set({
                            title: 'automobiles',
                            type: ''
                        });
                    });

                    it('is invalid', function() {
                        expect(category.isValid()).to.not.be.ok;
                        expect(category.validationError)
                            .to.have.property('type');
                    });
                });

                describe('unknown', function() {
                    beforeEach(function() {
                        category.set({
                            title: 'automobiles',
                            type: 'unknown'
                        });
                    });

                    it('is invalid', function() {
                        expect(category.isValid()).to.not.be.ok;
                        expect(category.validationError)
                            .to.have.property('type');
                    });
                });
            });
        });
    });
});

describe('Models.Categories', function() {
    var categories;

    beforeEach(function() {
        categories = new Application.Models.Categories();
    });

    it('has Category as #model', function() {
        expect(categories.model).to.deep.equal(Application.Models.Category);
    });

    it('has #url', function() {
        expect(categories.url()).to.be.ok;
    });
});
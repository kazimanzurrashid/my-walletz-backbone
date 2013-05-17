var Application;

(function ($, _, Backbone, Application) {
    var Views = Application.Views || (Application.Views = {});

    Views.CategoryListItem = Backbone.View.extend({
        tagName: 'li',

        events: {
            'dblclick .display .uneditable-input': 'showEdit',
            'blur .edit input[type="text"]': 'showDisplay',
            'keydown .edit input[type="text"]': 'onUpdateOrCancel'
        },

        initialize: function(options) {
            this.template = options.template;
            this.destroyAnimation = options.destroyAnimation || function (el) {
                return el.slideUp();
            };
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },
        
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.display = this.$('.display');
            this.edit = this.$('.edit');
            this.textbox = this.edit.find('input[type="text"]');
            return this;
        },

        remove: function(notify) {
            if (typeof notify === 'undefined') {
                notify = true;
            }

            if (!notify) {
                Backbone.View.prototype.remove.call(this);
                return this;
            }

            this.trigger('removing');

            var self = this;
            this.destroyAnimation(this.$el)
                .promise()
                .done(function () {
                    Backbone.View.prototype.remove.call(self);
                });

            return this;
        },

        update: function() {
            var title = this.textbox.val();
            var oldTitle = this.model.get('title');

            if (!title.length) {
                this.textbox.val(oldTitle);
                return;
            }

            var self = this;

            this.model.save({ title: title }, {
                validate: false,
                success: function () {
                    $.showSuccessbar('<strong>' + oldTitle + '</strong>' +
                        ' category updated.');
                },
                error: function () {
                    $.showErrorbar('An unexpected error has occurred while ' +
                        'updating <strong>' +
                        oldTitle +
                        '</strong> category.');

                    self.textbox
                        .val(oldTitle)
                        .select();
                    self.showEdit();
                }
            });

            this.showDisplay();
        },

        showEdit: function () {
            this.display.hide();
            this.edit.show();
            this.textbox.focus();
        },

        showDisplay: function() {
            this.edit.hide();
            this.display.show();
        },

        onUpdateOrCancel: function (e) {
            if (e.which === 13) {
                e.preventDefault();
                this.update();
            } else {
                if (e.which === 27) {
                    e.preventDefault();
                    this.showDisplay();
                }
            }
        }
    });

    Views.CategoryList = Backbone.View.extend({
        events: {
            'keydown > ul input[type="text"]': 'onCreate'
        },

        initialize: function(options) {
            this.type = options.type;
            this.dataList = new Application.Components.DataList({
                el: this.$('> ol'),
                childViewFactory: function(model) {
                    return new Views.CategoryListItem({
                        model: model,
                        template: options.template
                    });
                },
                collection: this.collection,
                itemInsertMode: Application.Components.DomInsertMode.append
            });

            this.listenTo(this.dataList, 'command', this.onCommand);
        },

        render: function() {
            this.dataList.render();
            return this;
        },

        destroy: function(model) {
            var title = model.get('title');

            var confirmOption = {
                prompt: 'Are you sure you want to delete <strong>' +
                    title +
                    '</strong> category?',
                ok: function() {
                    model.destroy({
                        success: function() {
                            $.showSuccessbar('<strong>' + title + '</strong>' +
                                ' category deleted successfully.');
                        },
                        error: function() {
                            $.showErrorbar('An error has occurred while ' +
                                'deleting <strong>' +
                                title +
                                '</strong> category.');
                        }
                    });
                }
            };

            $.confirm(confirmOption);
        },

        onCommand: function(e) {
            if (e.command !== 'delete') {
                return;
            }
            e.preventDefault();
            this.destroy(e.model);
        },

        onCreate: function(e) {
            if (e.which !== 13) {
                return;
            }

            e.preventDefault();

            var textbox = $(e.currentTarget);
            var title = textbox.val();

            if (!title.length) {
                return;
            }

            this.collection.create({
                    title: title,
                    type: this.type
                }, {
                    validate: false,
                    success: function() {
                        $.showSuccessbar('New category created.');
                        textbox.val('');
                    },
                    error: function() {
                        $.showErrorbar('An unexpected error has occurred while ' +
                            'creating new category.');
                        textbox.select();
                    }
                });
        }
    });

    function filterExpenses(collection) {
        return collection.filter(function (model) {
            return model.isExpense();
        });
    }
 
    function filterIncomes(collection) {
        return collection.filter(function (model) {
            return model.isIncome();
        });
    }

    Views.CategoryTabbedList = Backbone.View.extend({
        el: '#category-list-page',

        initialize: function() {
            var Models = Application.Models;

            var expenses = new Models.Categories;
            var incomes = new Models.Categories;

            expenses.reset(filterExpenses(this.collection));
            incomes.reset(filterIncomes(this.collection));

            this.attachSync(expenses);
            this.attachSync(incomes);

            var self = this;

            this.listenTo(this.collection, 'reset', function () {
                expenses.reset(filterExpenses(self.collection));
                incomes.reset(filterIncomes(self.collection));
            });

            var template = _.template(
                this.$('#category-list-item-template').html());

            this.expenseList = new Views.CategoryList({
                collection: expenses,
                el: '#expense-list',
                type: Models.CategoryType.expense,
                template: template
            });

            this.incomesList = new Views.CategoryList({
                collection: incomes,
                el: '#income-list',
                type: Models.CategoryType.income,
                template: template
            });
        },

        render: function() {
            this.expenseList.render();
            this.incomesList.render();

            return this;
        },

        attachSync: function (collection) {
            var self = this;

            this.listenTo(collection, 'add', function (model) {
                self.collection.add(model, { silent: true });
            });

            this.listenTo(collection, 'remove destroy', function(model) {
                self.collection.remove(model, { silent: true });
            });
        }
    });

    _.extend(Views.CategoryTabbedList.prototype, Views.Activable);

})(jQuery, _, Backbone, Application || (Application = {}));
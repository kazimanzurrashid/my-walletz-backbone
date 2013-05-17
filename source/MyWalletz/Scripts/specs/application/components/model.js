var DummyModel = Backbone.Model.extend({
    defaults: function() {
        return {
            foo: null,
            bar: null
        };
    }
});

var DummyModels = Backbone.Collection.extend({
    model: DummyModel
});
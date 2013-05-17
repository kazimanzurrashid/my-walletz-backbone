var Application;

(function ($, _, Application) {
    var Views = Application.Views || (Application.Views = {});

    Views.Helpers = {
        hasModelErrors: function(jqxhr) {
            return jqxhr.status === 400;
        },

        getModelErrors: function(jqxhr) {
            var response = null;

            try {
                response = $.parseJSON(jqxhr.responseText);
            } catch(e) {
            }

            if (!response) {
                return void(0);
            }

            var modelStateProperty = _.chain(response)
                .keys()
                .filter(function(key) {
                    return key.toLowerCase() === 'modelstate';
                })
                .first()
                .value();

            return modelStateProperty ?
                response[modelStateProperty] :
                void(0);
        },

        subscribeModelInvalidEvent: function(model, el) {
            model.once('invalid', function() {
                el.showFieldErrors({
                    errors: model.validationError
                });
            });
        },

        formatMoney: function(amount, symbol) {
            if (typeof symbol === "undefined") {
                symbol = '';
            }

            if (!amount) {
                return '';
            }

            return accounting.formatMoney(amount, {
                precision: 2,
                symbol: symbol,
                format: {
                    pos: '%s %v',
                    neg: '%s (%v)',
                    zero: '%s %v'
                }
            });
        },
        
        formatDate: function(date) {
            return date ? moment(date).format('MM/DD/YYYY') : '';
        }
    };

})(jQuery, _, Application || (Application = {}));
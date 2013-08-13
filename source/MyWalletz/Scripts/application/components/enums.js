/* jshint browser: true, curly: true, eqeqeq: true, forin: true, latedef: true,
    newcap: true, noarg: true, noempty: true, nonew: true, strict:true,
    undef: true, unused: true */

(function(App) {
    'use strict';

    var Components = App.Components || (App.Components = {});
    
    Components.DomInsertMode = {
        append: 0,
        prepend: 1
    };
})(window.App || (window.App = {}));
var Application;

(function(Application) {
    var Components = Application.Components || (Application.Components = {});
    
    Components.DomInsertMode = {
        append: 0,
        prepend: 1
    };
})(Application || (Application = {}));
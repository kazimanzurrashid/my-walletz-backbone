var App;

(function (App) {
    App.clientUrlPrefix = '#!/';
    App.serverUrlPrefix = '/api';
})(window.App || (window.App = {}));

function repeatString(length, character) {
    if (typeof length === "undefined") {
        length = 1;
    }
    
    if (typeof character === "undefined") {
        character = 'x';
    }

    return (new Array(length + 1)).join(character);
}
var Storage = function () {
};

Storage.prototype.setObject = function (key, value) {
    localStorage.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function (key) {
    var value = localStorage.getItem(key);
    return value && JSON.parse(value);
};

var storage = new Storage();

$(document).ready(function () {
    console.log("test");

    var $refresh = $("#refresh");
    $refresh.click(function () {

        var barData = [];
        var preferences = storage.getObject('preferences');

        for (var preference in preferences) {
            if (preferences.hasOwnProperty(preference)) {
                barData.push(preferences[preference]);
            }
        }


        console.log('barData -- start');

        for (var i in barData) {
            console.log(barData[i]);
        }

        console.log('barData -- end');


        initBars(barData)

    });

    $refresh.click();
    $(".nav-tabs li").on("click",function() {
        $(".nav-tabs li").removeClass("active");
        $(this).addClass("active");
        $(".starter-template .svgwrapper").toggle();
        $(".starter-template .keywordwrapper").toggle();
    });
});
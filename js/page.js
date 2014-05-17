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

    var tabids = [];
    var $hideMA = $("#hide-my-ass");
    $hideMA.click(function(){
        var preferences = storage.getObject("preferences");
        
        var maxval = 0;
        for (cat in categories){
            if(cat in preferences && preferences[cat].value > maxval){
                maxval = preferences[cat].value;
            }
        }
        // console.log("maxval: "+maxval);
        var catindex = {};
        for (cat in categories){
            var val = 0
            if(cat in preferences ){
                val = preferences[cat].value;
            }

            if(val< maxval){
                var newURL = "http://"+categories[cat][0];
                chrome.tabs.create({ url: newURL , active: false}, function(tab){
                    setTimeout(function() {
                        chrome.tabs.remove([tab.id]);
                    },2000);
                });                
            }
        }
        setTimeout(function() {
            $refresh.click();
        },4000);


    });

    $(".nav-tabs li").on("click",function() {
        $(".nav-tabs li").removeClass("active");
        $(this).addClass("active");
        $(".starter-template .svgwrapper").toggle();
        $(".starter-template .keywordwrapper").toggle();
    });
});
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
    // console.log("test");

    var $refresh = $("#refresh");
    $refresh.click(function () {

        var barData = [];
        var preferences = storage.getObject('preferences');

        for (var preference in preferences) {
            if (preferences.hasOwnProperty(preference)) {
                barData.push(preferences[preference]);
            }
        }


        // console.log('barData -- start');

        // for (var i in barData) {
        //     console.log(barData[i]);
        // }

        // console.log('barData -- end');


        initBars(barData)

    });

    $refresh.click();

    var tabids = [];
    var $hideMA = $("#hide-my-ass");
    $hideMA.text("start hide my ass");
    $hideMA.click(function(){
        if($hideMA.text()=="start hide my ass"){
            $hideMA.text("stop hide my ass");    
        }else {
            $hideMA.text("start hide my ass");
        }
        
        var preferences = storage.getObject("preferences");
        var maxval = 0;
        var minval;
        var mincat = categories[0];
        for (cat in categories){
            if(cat in preferences ){
                var pref = preferences[cat];
                if (pref.value > maxval){
                    maxval = pref.value.value;    
                }
                if(pref.value < minval) {
                    minval = pref.value;
                    mincat = pref.name;
                }
            } else {
                minval = 0;
                mincat = cat;
            }
        }
         console.log("maxval: "+maxval);
         console.log("minval: "+minval);
         console.log("mincat: "+mincat);


        var catindex = {};
        for (cat in categories){
            var val = 0
            if(cat in preferences ){
                val = preferences[cat].value;
            }

            if(val< maxval){
                var newURL = "http://"+categories[cat][0];
                // chrome.tabs.create({ url: newURL , active: false}, function(tab){
                //     setTimeout(function() {
                //         chrome.tabs.remove([tab.id]);
                //     },2000);
                // });                
            }
        }
        // setTimeout(function() {
        //     $refresh.click();
        //     hideMyAss();
        // },4000);


    });

    var $reset = $("#reset");
    $reset.click(function(){
        storage.setObject('preferences', {});        
    });



    $(".nav-tabs li").on("click",function() {
        $(".nav-tabs li").removeClass("active");
        $(this).addClass("active");
        $(".starter-template .svgwrapper").toggle();
        $(".starter-template .keywordwrapper").toggle();
    });
});

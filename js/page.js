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

var hidejob = {};
var refreshjob = {};

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
    $hideMA.text("Faking on");
    $hideMA.click(function(){
        if($hideMA.text()=="Faking on"){

            $hideMA.text("Faking off"); 
            
            hidejob = setInterval(function(){
                // console.log("job interval open openMinValURL");
                openMinValURL()
            }, 500);
            refreshjob = setInterval(function(){
                // console.log("job2 interval refresh");
                $refresh.click();
            }, 5000);
            startHideMyAss();
            $(".hiding").show();
        }else {

            $hideMA.text("Faking on");

            clearInterval(hidejob);
            clearInterval(refreshjob);
            $refresh.click();
            // console.log("stopped hma");
            stopHideMyAss();
            $(".hiding").hide();
        }
        
        
        var openMinValURL = function(){
            
            var preferences = storage.getObject("preferences");
            var maxval = 0;
            var minval = 5000000;
            var mincat = categories[0];
            var maxcat = categories[0];
            for (cat in categories){
                if(cat in preferences ){
                    var pref = preferences[cat];
                    if (pref.value > maxval){
                        maxval = pref.value;    
                        maxcat = pref.name;
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
             // console.log("maxval: "+maxval);
             
             console.log("min: ",mincat, " ", minval);
             console.log("max: ",maxcat," ",maxval);
             var urls = categories[mincat];
             var idx = Math.floor((Math.random() * urls.length));
             console.log("idx: ", idx);
             var url = "http://"+urls[idx];
             

             console.log("opening url: "+url);
             chrome.tabs.create({ url: url , active: false}, function(tab){
                setTimeout(function() {
                    chrome.tabs.remove([tab.id]);
                    // console.log("closing url: "+url);
                },4000);
             });                
        }

    });

    var $reset = $("#reset");
    $reset.click(function(){
        storage.setObject('preferences', {});      
        $refresh.click();  
        // console.log(storage.getObject('preferences'));
    });



    $(".nav-tabs li").on("click",function() {
        $(".nav-tabs li").removeClass("active");
        $(this).addClass("active");
        $(".starter-template .svgwrapper").toggle();
        $(".starter-template .keywordwrapper").toggle();
    });
});

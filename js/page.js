$(document).ready(function () {
    console.log("test");

    $("#refresh").click(function () {

        var barData = [];

        for (var preference in preferences) {
            if (preferences.hasOwnProperty(preference)) {
                barData.push({
                    value: preferences[preference],
                    name: preference
                });
            }
        }


        console.log('barData -- start');

        for (var i in barData) {
            console.log(barData[i]);
        }

        console.log('barData -- end');


        initBars(barData)

    })
});
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

        initBars(barData)

    })
});
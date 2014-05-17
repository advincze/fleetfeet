// console.log("-.-");

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

if (null == storage.getObject('preferences')) {
    storage.setObject('preferences', {});
}
if (null == storage.getObject('requests')) {
    storage.setObject('requests', {});
}
if (null == storage.getObject('urls')) {
    storage.setObject('urls', {});
}
if (null == storage.getObject('domains')) {
    storage.setObject('domains', {});
}
if (null == storage.getObject('profile')) {
    storage.setObject('profile', {
        samples: 0
    });
}

categories = {
    shopping: ["zalando.de", "otto.de", "notebooksbilliger", "cyberport.de", "amazon.de", "amazon.com", "ebay.de", "ebay.com", "idealo.de", "guenstiger.de", "billiger.de"],
    entertainment: ["prosieben.de", "sat1.de", "kabeleins.de", "t-online.de", "maxdome.de", "watchever.de"],
    social: ["twitter.de", "twitter.com", "facebook.de", "facebook.com", "myspace.de", "linkedin.com", "pinterest.com", "tumblr.com", "instagram.com"],
    news: ["welt.de", "spiegel.de", "faz.net", "bild.de", "n24.de", "sz.de", "zeit.de", "news.google.de", "focus.de", "heise.de"],
    research: ["wikipedia.org", "wikipedia.de", "gutefrage.net", "helpster.de", "wer-weiß-was.de", "answers.yahoo.com"],
    sports: ["formel1.de", "bundesliga.de", "kicker.de", "spox.com", "sport1.de", "de.eurosport.yahoo.com", "11freunde.de", "sportschau.de"],
    leisure: ["fressnapf.de", "zooplus.de", "pokerstars.eu", "fulltiltpoker.eu", "tvmovie.de", "tvspielfilm.de", "4players.de", "yelp.de", "mcfit.com" ],
    travel: ["hotel.de", "ab-in-den-urlaub.de", "weg.de", "holidaycheck.de", "expedia.de", "tripadvisor.de"]
};

var funcB = function (details) {

    function getHeader(name, fallback) {
        for (var i = 0, l = details.responseHeaders.length; i < l; ++i) {
            if (details.responseHeaders[i].name.toLowerCase() == name) {
                return details.responseHeaders[i].value;
            }
        }
        return fallback;
    }

    /**
     * for a given category, add this domain and with it the array of keywords
     */
    function registerPreference(category, domain, keywords) {

        // console.log( "registerPreference(",category, domain, keywords,")");

        /**
         * add some {@code newKeyword} to an existing set of {@code keywords}
         */
        function mergeKeywords(keywords, newKeyword) {

            //  console.log("adding " + newKeyword + " to " + keywords);

            for (var j = 0; j < keywords.length; j++) {

                if (keywords[j].text === newKeyword) {
                    keywords[j].size++;
                    return;
                }
            }

            keywords.push({
                text: newKeyword,
                size: 1
            })
        }


        var preferences = storage.getObject('preferences');

        if (typeof preferences[category] === "undefined") {
            preferences[category] = {
                value: 1,
                name: category,
                domains: new Array(domain),
                keywords: []
            };
            for (var i = 0; i < keywords.length; i++) {
                preferences[category].keywords.push({
                    text: keywords[i],
                    size: 1
                });
            }
        } else {
            preferences[category].value++;
            preferences[category].domains.push(domain);
            for (var i = 0; i < keywords.length; i++) {
                mergeKeywords(preferences[category].keywords, keywords[i]);
            }
        }

        storage.setObject('preferences', preferences);
    }

    /** try to categorize the domain into one of the predefined categories, also fetch the keywords for the URL */
    function categorizeDomain(domain, url) {

        console.log("categorizeDomain(",domain, url,")");
        // console.log("header",getHeader("Content-Type", null));
        // console.log("header",getHeader("content-type", null));
        
        if (url.indexOf("http://www.welt.de/geoinfo/info/ip/") === 0){
            // console.log("ignore own calls");
            return;
        }


        if (getHeader("content-type", null).indexOf("text/html") === 0) {
            // console.log("domain: ", domain);

            $.get(url, function (data) {
                var match = /meta\s+name="keywords"\s+content="(.*)"/gm.exec(data);

                function htmlDecode(value) {
                    return $('<div/>').html(value).text();
                }

                var keywordsForUrl = [];


                if (null != match && match.length > 0) {
                    var keywords = htmlDecode(match[1]).split(/[,;]+/);
                    if (typeof keywords != "undefined" && keywords.length > 0) {
                        keywordsForUrl = keywords;
                    }
                }

                for (var category in categories) {
                    if (categories.hasOwnProperty(category)) {
                        var urls = categories[category];

                        for (var i = 0; i < urls.length; i++) {
                            if (domain === urls[i]) {
                                registerPreference(category, domain, keywordsForUrl);
                            }
                        }
                    }
                }

            });
        }
    }

    var url = details.url;
    var domain = url.match(/([\w-]+\.\w+)\//)[1];
    var headers = details.requestHeaders, blockingResponse = {};

    var contentLength = getHeader("Content-Length", 0);
    /** skip this URL if size is above threshold and it is of a certain type */
    var skip = /(\.jpeg|\.jpg|\.png|\.gif|\.bmp|\.css)$/g.test(url)
        && contentLength > 200;

    if (!skip) {
        categorizeDomain(domain, url);
    }

    blockingResponse.requestHeaders = headers;
    return blockingResponse;
};
///** send */
//chrome.webRequest.onBeforeSendHeaders.addListener(funcA,
//    {urls: [ "<all_urls>" ]},
//    ['requestHeaders', 'blocking']);
//
/** receive */
chrome.webRequest.onHeadersReceived.addListener(funcB,
    {urls: [ "<all_urls>" ]},
    ['responseHeaders', 'blocking']);

/** completed --> fetch geoinfo*/
chrome.webRequest.onCompleted.addListener(function (details) {
        // update geo info
        $.get("http://www.welt.de/geoinfo/info/ip/", function (data) {
            var profile = storage.getObject("profile");
            profile.geoinfo = data;
            storage.setObject("profile", profile);
        });

    },
    {urls: [ "<all_urls>" ]});

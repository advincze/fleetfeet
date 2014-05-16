console.log("-.-");
var requests = {};
var urls = {};
var preferences = {};
var domains = {};

categories = {
    shopping: ["zalando.de", "otto.de", "notebooksbilliger", "cyberport.de", "amazon.de", "amazon.com", "ebay.de", "ebay.com", "idealo.de", "guenstiger.de", "billiger.de"],
    entertainment: ["prosieben.de", "sat1.de", "kabeleins.de", "t-online.de", "maxdome.de", "watchever.de"],
    social: ["twitter.de", "twitter.com", "facebook.de", "facebook.com", "myspace.de", "linkedin.com", "pinterest.com", "tumblr.com", "instagram.com"],
    news: ["welt.de", "spiegel.de", "faz.net", "bild.de", "n24.de", "sz.de", "zeit.de", "news.google.de"],
    research: ["wikipedia.org", "wikipedia.de", "gutefrage.net", "helpster.de", "wer-weiß-was.de", "answers.yahoo.com"],
    sports: ["formel1.de", "bundesliga.de", "kicker.de", "spox.de", "sport1.de", "de.eurosport.yahoo.com", "11freunde.de", "sportschau.de"],
    leisure: ["fressnapf.de", "zooplus.de", "pokerstars.eu", "fulltiltpoker.eu", "tvmovie", "tvspielfilm", "4players.de", "yelp.de", "mcfit.com" ],
    travel: ["hotel.de", "ab-in-den-urlaub.de", "weg.de", "holidaycheck.de", "expedia.de", "tripadvisor.de"]
};

var funcA = function (details) {

};

var funcB = function (details) {

    function registerPreference(category, domain) {
        if (typeof preferences[category] === "undefined") {
            preferences[category] = {
                value : 1,
                name: category,
                domains: new Array(domain)
            };
        } else {
            preferences[category].value++;
            preferences[category].domains.push(domain);
        }
    }

    function categorizeDomain(domain) {

        for (var category in categories) {
            if (categories.hasOwnProperty(category)) {
                var urls = categories[category];
                for (var i = 0; i < urls.length; i++) {
                    if (domain === urls[i]) {
                        registerPreference(category, domain);
                    }
                }
            }
        }
    }

//    function categorizeSearch(domain, url) {
//        switch (domain) {
//            case "google.de":
//                registerPreference(/q=(.*)(&|$)]/.exec(url)[1]);
//                break;
//            case "amazon.de":
//                break;
//
//            case "twitter.com":
//                break;
//        }
//    }

    var headers = details.requestHeaders, blockingResponse = {};

    requests[details.requestId] = details;

    // categorize

    var url = details.url;
    if (typeof urls[url] != "undefined") {
        urls[url]++;
    } else {
        urls[url] = 1;
    }
    var domain = url.match(/(\w+\.\w+)\//)[1];

    var contentLength = 0;
    for (var i = 0, l = details.responseHeaders.length; i < l; ++i) {
        if (details.responseHeaders[i].name == "Content-Length") {
            break;
        }
    }

    var skip = /(\.gif|\.png|\.gif|\.bmp)$/g.test(url)
        && contentLength > 1000;

    if (!skip) {

        if (typeof domains[domain] != "undefined") {
            categorizeDomain(domain);
            domains[domain]++;
        } else {
            domains[domain] = 1;
        }
    }

    blockingResponse.requestHeaders = headers;
    return blockingResponse;
};
/** send */
chrome.webRequest.onBeforeSendHeaders.addListener(funcA,
    {urls: [ "<all_urls>" ]},
    ['requestHeaders', 'blocking']);

/** receive */
chrome.webRequest.onHeadersReceived.addListener(funcB,
    {urls: [ "<all_urls>" ]},
    ['responseHeaders', 'blocking']);

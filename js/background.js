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
    research: ["wikipedia.org", "gutefrage.net", "helpster.de", "wer-weiß-was.de", "answers.yahoo.com"],
    sports: ["formel1.de", "bundesliga.de", "kicker.de", "spox.de", "sport1.de", "de.eurosport.yahoo.com", "11freunde.de", "sportschau.de"],
    leisure: ["fressnapf.de", "zooplus.de", "pokerstars.eu", "fulltiltpoker.eu", "tvmovie", "tvspielfilm", "4players.de", "yelp.de", "mcfit.com" ],
    travel: ["hotel.de", "ab-in-den-urlaub.de", "weg.de", "holidaycheck.de", "expedia.de", "tripadvisor.de"]
};


chrome.webRequest.onHeadersReceived.addListener(function (details) {

        console.log("Received", details);
        requests[details.requestId].received = details;

    },
    {urls: [ "<all_urls>" ]},
    ['responseHeaders', 'blocking']);


var beforeSendHeadersFunc = function (details) {

    function categorizeDomain(domain) {

        for (var category in categories) {
            if (categories.hasOwnProperty(category)) {
                var urls = categories[category];
                for (var i = 0; i < urls.length; i++) {
                    if (domain === urls[i]) {
                        if (typeof preferences[category] === "undefined") {
                            preferences[category] = 1;
                        } else {
                            preferences[category]++;
                        }
                    }
                }
            }
        }
    }

    var headers = details.requestHeaders, blockingResponse = {};

    requests[details.requestId] = details;

    // categorize

    if (typeof urls[details.url] != "undefined") {
        urls[details.url]++;
    } else {
        urls[details.url] = 1;
    }
    var domain = details.url.match(/(\w+\.\w+)\//)[1];

    if (typeof domains[domain] != "undefined") {
        categorizeDomain(domain);
        domains[domain]++;
    } else {
        domains[domain] = 1;
    }
    for (var i = 0, l = headers.length; i < l; ++i) {
        if (headers[i].name == 'User-Agent') {
            console.log("Send", details);
            //console.log(headers[i].value);
            break;
        }
    }
    blockingResponse.requestHeaders = headers;
    return blockingResponse;
};
chrome.webRequest.onBeforeSendHeaders.addListener(beforeSendHeadersFunc,
    {urls: [ "<all_urls>" ]},
    ['requestHeaders', 'blocking']);
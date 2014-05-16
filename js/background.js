console.log("-.-");
var requests = {};
var urls = {};
var preferences = {};
var domains = {};

categories = {
    shopping: ["amazon.de"],
    entertainment: ["youtube.de"],
    social: ["facebook.com"],
    news: ["welt.de"],
    research: ["wikipedia.de", "stackoverflow.com"],
    sports: ["sport.de"],
    leisure: ["youporn.com"]
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
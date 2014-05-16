console.log("-.-");
var requests = {};
var urls = {};
var domains = {};
chrome.webRequest.onHeadersReceived.addListener(function(details){

	console.log("Received",details);
	requests[details.requestId].received = details;
},{urls: [ "<all_urls>" ]},['responseHeaders','blocking']);
chrome.webRequest.onBeforeSendHeaders.addListener(function(details){
  var headers = details.requestHeaders,
  blockingResponse = {};
  requests[details.requestId] = details;
  if(typeof urls[details.url] != "undefined") {
  	urls[details.url]++;
  } else {
  	urls[details.url] = 1;
  } 
  var domain = details.url.match(/\w+\.\w+\//)[0];
  if(typeof domains[domain] != "undefined") {
  	domains[domain]++;
  } else {
  	domains[domain] = 1;
  } 

  
  for( var i = 0, l = headers.length; i < l; ++i ) {
    if( headers[i].name == 'User-Agent' ) {
     
      console.log("send",details);
      //console.log(headers[i].value);
      break;
    }
    
  }

  blockingResponse.requestHeaders = headers;
  return blockingResponse;
},
{urls: [ "<all_urls>" ]},['requestHeaders','blocking']);
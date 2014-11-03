var request = require('request');

module.exports = (function() {

  const ALCHEMY = "http://access.alchemyapi.com/calls/url/URLGetText?apikey=3d94ba5add4573f225632a2dda7ca1d76f89d5ca";

  /* requestAlchemy
   * Sends a request to DBpedia spotlight.
   * @param url the url argument
   * @param callback the callback function to execute when ready
   */

  function requestAlchemy(url, callback) {

    var args = "&url="+ encodeURI(url) + "&outputMode=json";

    request({
      uri: ALCHEMY + args,
      method: "GET",
      timeout: 15000,
      followRedirect: true,
      headers: {
        "Accept": "application/json"
      },
      maxRedirects: 3
    }, function(error, response, body) {
      console.log(error);
      var responseObj = null;
      if(!error) {
        responseObj = JSON.parse(body);
      }
      callback(responseObj);
    });
  }

  return {

    setConfidence: function setConfidence(float) {
      confidence = parseFloat(float, 10);
    },

    /* getResources
     * Sends a request to DBpedia spotlight using requestAlchemy function.
     * @param text The text to annotate
     * @return A list with all the resource URIs
     */

    getResources: function getResources(text, callback) {
      var resources = {};
      //Sends the request 
      requestAlchemy(text, function (object) {
        if(object == null) {
          console.log("Empty object cant be annotated.");
          return null;
        }
		
		/*console.log(object);
		var URIList = [];
		URIList.push("bonjour");*/
		
        var text = object.text;
		
		
		
		
        /*annotation.surfaceForm.forEach(function (data) {
          if(data.resource) {
            //If it's an array, length will not be undefined
            if(data.resource.length !== undefined) {
              data.resource.forEach(function (resource) {
                //Push all the results as object keys (so they can be unique)
                resources[resource["@uri"]] = true;
              });
            } else {
              //Push the object result as an object key (so it can be unique)
              resources[data.resource["@uri"]] = true;
            }
          }
        });*/
        /*var URIList = [];
        //Iterates over all object keys and add them to the list
        Object.keys(resources).forEach(function(resource) {
          URIList.push(resource);
        });*/
        //console.log(URIList);
        callback(text);
      });
    }
  }
})();
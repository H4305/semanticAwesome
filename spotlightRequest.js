var request = require('request');

module.exports = (function() {

  const RESOURCE_URI = "http://dbpedia.org/resource/";
  const DBPEDIA_SPOTLIGHT = "http://spotlight.dbpedia.org/rest/candidates";
  const BASE_CONFIDENCE = "0.3";

  var confidence = BASE_CONFIDENCE;

  /* requestSpotlight
   * Sends a request to DBpedia spotlight.
   * @param text the text argument
   * @param callback the callback function to execute when ready
   */

  function requestSpotlight(text, callback) {

    var args = "?text="+ encodeURI(text) + "&confidence=" + confidence;

    request({
      uri: DBPEDIA_SPOTLIGHT + args,
      method: "GET",
      timeout: 30000,
      followRedirect: true,
      headers: {
        "Accept": "application/json"
      },
      maxRedirects: 3
    }, function(error, response, body) {
      //console.log(error);
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
     * Sends a request to DBpedia spotlight using requestSpotlight function.
     * @param text The text to annotate
     * @return A list with all the resource URIs
     */

    getResources: function getResources(text, callback) {
      var resources = {};
      //Sends the request 
      requestSpotlight(text, function (object) {
        if(object == null) {
          console.log("Empty object cant be annotated.");
          return null;
        }
        var annotation = object.annotation;
        annotation.surfaceForm.forEach(function (data) {
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
        });
        var URIList = [];
        //Iterates over all object keys and add them to the list
        Object.keys(resources).forEach(function(resource) {
          URIList.push(resource);
        });
        //console.log(URIList);
        callback(URIList);
      });
    }
  }
})();

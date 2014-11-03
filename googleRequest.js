var request = require('request');

module.exports = (function() {

  const GOOGLE = "https://www.googleapis.com/customsearch/v1";  
  var gkey = "AIzaSyDTKQHpVvvyAiVBF92GH4E0CE-fHSkr16E";
  var cx = "011944880399546755950%3Ar7ud99txd5w";
  var query = "sushi";

  /* requestGoogle
   * Sends a request to DBpedia spotlight.
   * @param text the text argument
   * @param callback the callback function to execute when ready
   */

  function requestGoogle(text, callback) {

    var args = "?key=" + gkey + "&cx=" + cx + "&q=" + query;

    request({
      uri: GOOGLE + args,
      method: "GET",
      timeout: 30000,
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

    /* getResources
     * Sends a request to DBpedia spotlight using requestGoogle function.
     * @param text The text to annotate
     * @return A list with all the resource URIs
     */

    getResources: function getResources(text, callback) {
      var resources = {};
      //Sends the request 
      requestGoogle(text, function (object) {
        if(object == null) {
          console.log("Empty object cant be annotated.");
          return null;
        }
        var URIList = [];
        URIList.push("bonjour");
		console.log(object);
		
		
		// Juste ici il faut que tu fasses ta boucle sur les items
		
		
       /* var annotation = object.annotation;
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
          URIList.push(RESOURCE_URI + resource);
        });
        console.log(URIList);*/
        callback(URIList);
      });
    }
  }
})();
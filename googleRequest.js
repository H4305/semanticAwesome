var request = require('request');

module.exports = (function() {

  const GOOGLE = "https://www.googleapis.com/customsearch/v1";  
  const GKEY = "AIzaSyDTKQHpVvvyAiVBF92GH4E0CE-fHSkr16E";
  const CX = "011944880399546755950%3Ar7ud99txd5w";

  /* requestGoogle
   * Sends a request to google custom search API.
   * @param text the text argument
   * @param callback the callback function to execute when ready
   */

  function requestGoogle(query, callback) {

    var args = "?key=" + GKEY + "&cx=" + CX + "&q=" + query;

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

      //console.log(error);
      var responseObj = null;

      if(!error) {

        responseObj = JSON.parse(body);

      }

      callback(responseObj);

    });
  }

  return {

    /* getResources
     * Call requestGoogle function to get the URI list
     * @param text The text to search
     * @return A list with all the resource URIs
     */

    getResources: function getResources(query, callback) {

      var resources = {};

      //Sends the request 
      requestGoogle(query, function (object) {

        if(object == null) {

          console.log("No results for query:" + query);
          return null;

        }	
		    
        var JSONObjSize = object['items'].length;

        var URIList = [object['items'][0]['link']];

        console.log("LENGTH = " + JSONObjSize);

        for (i = 1; i < JSONObjSize; i++)
        { 
          URIList.push(object['items'][i]['link']);
        }

        callback(URIList);

      });
    }
  }
})();

var request = require('request');

module.exports = (function() {

  const DBPEDIAPRX = "http://lookup.dbpedia.org/api/search/PrefixSearch";
  var MaxHits = 4;
 
  /* autoComplete
   * Sends a request to google custom search API.
   * @param text the text argument
   * @param callback the callback function to execute when ready
   */

  function autoComplete(query, callback) {

    var args = "?QueryClass=&MaxHits=" + MaxHits + "&QueryString=" + query;

    request({
      uri: DBPEDIAPRX + args,
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
     * Call autoComplete function to get the link related to the query
     * @param text The text to search
     * @return A list with all the resource URIs
     */

    getResources: function getResources(query, callback) {

      var resources = {};

      //Sends the request  
      autoComplete(query, function (object) {

        if(object == null) {

          console.log("No results for query:" + query);
          return null;

        }	

        var JSONObjSize = object['results'].length;

        var URIList = [object['results'][0]['label']];

        console.log("LENGTH = " + JSONObjSize);

        for (i = 1; i < JSONObjSize; i++)
        { 
          URIList.push(object['results'][i]['label']);
          console.log(object['results'][i]['label']);
        }
        
        callback(URIList);

      });
    }
  }
})();

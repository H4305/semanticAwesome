var request = require('request');

module.exports = (function() {

  const DBPEDIAPRX = "http://lookup.dbpedia.org/api/search/PrefixSearch";
  const WIKI = "http://en.wikipedia.org/w/api.php";
  var MaxHits = 5;
 
  /* autoComplete
   * Sends a request to wikipedia.
   * @param text the text argument
   * @param callback the callback function to execute when ready
   */

  function autoComplete(query, callback) {

    var argsB = "?QueryClass=&MaxHits=" + MaxHits + "&QueryString=" + query;
    var args = "?format=json&action=query&list=allpages&apprefix=" + query + "&aplimit=" + MaxHits;

    request({
      //uri: "http://en.wikipedia.org/w/api.php?format=json&action=query&list=allpages&apprefix=ber&aplimit=2",
      uri: WIKI + args,
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

        //var JSONObjSize = object['results'].length;

        /*
        var URIList = [object['results'][0]['label']];

        console.log("LENGTH = " + JSONObjSize);

        for (i = 1; i < JSONObjSize; i++)
        { 
          URIList.push(object['results'][i]['label']);
          console.log(object['results'][i]['label']);
        }
        */

        var JSONObjSize = object['query']['allpages'].length;

        if(JSONObjSize<1)
        {
          return [];
        }

        var URIList = [object['query']['allpages'][0]['title']];

        //console.log("LENGTH = " + JSONObjSize);
        console.log(object['query']);

        for (i = 1; i < JSONObjSize; i++)
        { 
          URIList.push(object['query']['allpages'][i]['title']);
        }
        
        callback(URIList);

      });
    }
  }
})();

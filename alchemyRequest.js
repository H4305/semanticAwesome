var request = require('request');

module.exports = (function() {
  const KEY = "3d94ba5add4573f225632a2dda7ca1d76f89d5ca";
  const ALCHEMY = "http://access.alchemyapi.com/calls/url/URLGetText";

  /* requestAlchemy
   * Sends a request to DBpedia spotlight.
   * @param url the url argument
   * @param callback the callback function to execute when ready
   */

  function requestAlchemy(url, callback) {

    var args = "?apikey=" + KEY + "&url="+ encodeURI(url) + "&outputMode=json";

    request({
      uri: ALCHEMY + args,
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
     * Sends a request to DBpedia spotlight using requestAlchemy function.
     * @param text The text to annotate
     * @return A list with all the resource URIs
     */

    getResources: function getResources(url, callback) {
      var resources = {};
      //Sends the request 
      requestAlchemy(url, function (object) {
        if(object == null) {
          console.log("Empty object cant be annotated.");
          return null;
        }		
        var content_text = object.text;
		
		var text_sliced = content_text.substring(0,500);


		//Just in order to reduce the number of words

		//console.log(text_sliced.length);
		text_sliced = text_sliced.replace(/[\.,-\/#!$'"%\^&\*;:{}=\-_`~()]/g,"");
		text_sliced = text_sliced.replace(/\b[^ ]{1,2}\b/g,"");
		//console.log(text_sliced.length);

		//console.log(text_sliced);
		
		/*
		// We have to test this part
		//
		var htmlPageWords = [];
		var table = text_sliced.split(" ");
		//console.log(table.length);

		table.forEach(function(word) {
			if (htmlPageWords.indexOf(word) < 0) {
				htmlPageWords.push(word);
			}
		});
		var final_string;
		htmlPageWords.forEach(function(word) {
			final_string = word + " ";
		});
		*/
		//content_text = final_string;
		
		// We have to test this part
		//
		
        callback(text_sliced);
      });
    }
  }
})();
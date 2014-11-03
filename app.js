var express = require('express');
var spotlight = require('./spotlightRequest.js');
var alchemy = require('./alchemyRequest.js');
var app = express();

var gkey = "AIzaSyDTKQHpVvvyAiVBF92GH4E0CE-fHSkr16E";
var cx = "011944880399546755950%3Ar7ud99txd5w";
var query = "sushi";

var text = "Nice is a large city in France on the French Riviera. It's a popular destination for vacationers both young and old, with something to offer nearly everyone. It is well known for the beautiful view on the Promenade des Anglais, its famous waterfront, and is an ethnically diverse port city. ";

var url = "http://en.wikipedia.org/wiki/%22Hello,_world!%22_program";

// Request routes

app.get('/', function (req, res) {

	//Find results for query  
	var xmlHttp = null;
	var theUrl = "https://www.googleapis.com/customsearch/v1?key=" + gkey + "&cx=" + cx + "&q=" + query;
	var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
	xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", theUrl, false );
	xmlHttp.send( null );

	var HttpResponse = JSON.parse(xmlHttp.responseText);

	for (i = 0; i < HttpResponse['items'].length; i++)
	{    
	    var link = HttpResponse['items'][i]['link'];
	    console.log(link);
	    
		alchemy.getResources(link, function (content_text) {
		
			var text_sliced = content_text.substring(0,150);
			console.log(text_sliced);

			/* Just in order to reduce the number of words */

			console.log(text_sliced.length);
			text_sliced = text_sliced.replace(/[\.,-\/#!$'"%\^&\*;:{}=\-_`~()]/g,"");
			text_sliced = text_sliced.replace(/\b[^ ]{1,2}\b/g,"");
			console.log(text_sliced.length);

			var lala = [];
			var table = text_sliced.split(" ");
			console.log(table.length);
			table.forEach(function(word) {
				if (lala.indexOf(word) < 0) {
					lala.push(word);
				}

			});
			console.log(lala.length);
			console.log(lala);

			/* Just in order to reduce the number of words */

					
			spotlight.getResources(text_sliced, function (URIList) {

				var response = "";

				URIList.forEach(function(URI) {

				  	response += URI + "<br>";
				});
				
				res.send(response);
			});
		});	   
	}  
});


var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
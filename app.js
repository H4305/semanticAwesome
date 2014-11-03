var express = require('express');
var spotlight = require('./spotlightRequest.js');
var alchemy = require('./alchemyRequest.js');
var app = express();

var text = "Nice is a large city in France on the French Riviera. It's a popular destination for vacationers both young and old, with something to offer nearly everyone. It is well known for the beautiful view on the Promenade des Anglais, its famous waterfront, and is an ethnically diverse port city. ";

var url = "http://en.wikipedia.org/wiki/%22Hello,_world!%22_program";

// Request routes

app.get('/', function (req, res) {

	alchemy.getResources(url, function (content_text) {
	
		var text_sliced = content_text.substring(0,150);
		console.log(text_sliced);
		
		console.log(text_sliced.length);
		text_sliced = text_sliced.replace(/[\.,-\/#!$'"%\^&\*;:{}=\-_`~()]/g,"");
		text_sliced = text_sliced.replace(/\b[^ ]{1,2}\b/g,"");
		console.log(text_sliced.length);
				
		spotlight.getResources(text_sliced, function (URIList) {
			var response = "";
			URIList.forEach(function(URI) {
			  response += URI + "<br>";
			});
			res.send(response);
		});
	});
});


var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
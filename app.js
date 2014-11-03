var express = require('express');
var spotlight = require('./spotlightRequest.js');
var alchemy = require('./alchemyRequest.js');
var google = require('./googleRequest.js');
var app = express();

var gkey = "AIzaSyDTKQHpVvvyAiVBF92GH4E0CE-fHSkr16E";
var cx = "011944880399546755950%3Ar7ud99txd5w";
var query = "sushi";

var text = "Nice is a large city in France on the French Riviera. It's a popular destination for vacationers both young and old, with something to offer nearly everyone. It is well known for the beautiful view on the Promenade des Anglais, its famous waterfront, and is an ethnically diverse port city. ";

var url = "http://en.wikipedia.org/wiki/%22Hello,_world!%22_program";

// Request routes

app.get('/testalchemy', function (req, res) {
	alchemy.getResources(url, function (content_text) {
		spotlight.getResources(content_text, function (URIList) {
			var response = "";
			URIList.forEach(function(URI) {
				response += URI + "<br>";
			});
			res.send(response);
		});
	});
});



app.get('/lala', function (req, res) {
	var results = "";
	google.getResources("aa", function (returne) {

		results += returne + "<br>";
	});
	res.send(results);
});

app.get('/', function (req, res) {

	var results = "";

	//Find results for query  
	var xmlHttp = null;
	var theUrl = "https://www.googleapis.com/customsearch/v1?key=" + gkey + "&cx=" + cx + "&q=" + query;
	var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
	xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", theUrl, false );
	xmlHttp.send( null );

	var HttpResponse = JSON.parse(xmlHttp.responseText);

	//For each http link found 
	for (i = 0; i < HttpResponse['items'].length; i++)
	{   
		var response = "";

	    var link = HttpResponse['items'][i]['link'];
	    console.log(link);

	    results +=  "Link : " + link + "<br>";
	    
	    //Get the text
		alchemy.getResources(link, function (content_text) {


			//console.log(htmlPageWords.length);
			//console.log(htmlPageWords);
			//Just in order to reduce the number of words ?? Unusefull
			
			//Get dbpedia links
			spotlight.getResources(content_text, function (URIList) {

				URIList.forEach(function(URI) {

				  	response += URI + "<br>";
				});	
			});

			results += response + "<br>";

		});
	}  

	//ONLY sends links associated to the query, because alchemy and spotlight fonctions are asynchrone
	res.send(results);
});


var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
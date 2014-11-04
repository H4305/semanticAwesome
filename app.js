var express = require('express');
var spotlight = require('./spotlightRequest.js');
var alchemy = require('./alchemyRequest.js');
var google = require('./googleRequest.js');
var app = express();

var mustacheExpress = require('mustache-express');

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


//FORT TEST PURPOSE ONLY
//Calling the google custom search API, and getting a list of links, related to the query
app.get('/testGoogleAPI', function (req, res) {

	//Query = sushi
	google.getResources("sushi", function (URIList) {

		var response = "";
		URIList.forEach(function(URI) {
			response += URI + "<br>";
		});

		res.send(response);
	});
});

app.get('/testGoogleAlchemy', function (req, res) {

	var response = "";
	//Query = sushi
	google.getResources("sushi", function (URIList) {

		URIList.forEach(function(URI) {
			alchemy.getResources(URI, function (content_text) {
				response += content_text + "<br><br>"; 
				console.log(content_text);
			});
		});

		res.send(response);
	});
});

app.route('/search').get(function(req,res,next){



  	res.send("Bonjour : " + req.query.q);

  	
});

app.route('/').get(function(req,res,next){
  res.render('home');
});

app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');
app.use(express.static('public'));

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
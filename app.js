var express = require('express');
var spotlight = require('./spotlightRequest.js');
var alchemy = require('./alchemyRequest.js');
var google = require('./googleRequest.js');
var tout = require('./src/tout.js');
var app = express();

var mustacheExpress = require('mustache-express');

var tabGlobal = [];

//app.get('/test', function (req, res) {
(function() {
	var requeste = "city of berlin in germany";
	var URIListBase;
	var rangGoogle = 0;
	spotlight.getResources(requeste, function (spot) {URIListBase = spot});

	var response = "";
	google.getResources(requeste, function (URIListGoogle) {
		console.log('-------------------');
		console.log(URIListGoogle);
		console.log('-------------------');
		URIListGoogle.forEach(function(URIgoogle) { 
			alchemy.getResources(URIgoogle, function (content_text) {
				spotlight.getResources(content_text, function (URIList) { 
					
					//console.log("LOOOOL" + rangGoogle + " lalalalal " + URIList);
					
					tout.getJaccard(URIList, URIListBase, function (coeffJacard) {

						var resultRankingRow = [];
						resultRankingRow[0] = URIgoogle;
						resultRankingRow[1] = coeffJacard;
						resultRankingRow[2] = rangGoogle++;
						
						tabGlobal.push(resultRankingRow);
						console.log('row:' + resultRankingRow);
						// mettre resultRankingRow dans un tableau global
						// et sort by coeffJacard
						
						
					});					
				});
			});
		});
	});

	console.log("Voila la liste : <br>");
	console.log(response);
})();


app.route('/search').get(function(req,res,next){
	res.render('results', {query:req.query.q});
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

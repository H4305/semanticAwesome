var express = require('express');
var spotlight = require('./spotlightRequest.js');
var alchemy = require('./alchemyRequest.js');
var google = require('./googleRequest.js');
var prefix = require('./autoComplete.js')
var tout = require('./src/tout.js');
var app = express();

var _ = require('underscore');
var mustacheExpress = require('mustache-express');

app.route('/search').get(function(req,res,next){
	makeRequest(req.query.q, function(results) {
		console.log(results);
		
		var obj = {
			query: req.query.q, 
			results: results,
			url: function () {
		    return this[0];
		  },
		  gindex: function () {
		    return this[2];
		  },
		  title: function () {
		    return this[3];
		  },
		  description: function () {
		  	return this[4];
		  }
		}
		res.render('results', obj);
	});
});

app.route('/').get(function(req,res,next){
  res.render('home');
});

app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');
app.use(express.static('public'));

app.route('/autoComplete/:query').get(function(req,res){

	prefix.getResources(req.params.query, function(LabelsList) {

			if(LabelsList!="noValue")
			{	
				var jSonResult = "{\"Labels\": [";

				LabelsList.forEach(function(Label) {
					jSonResult += "\"" + Label + "\",";
				});
				jSonResult = jSonResult.substring(0, jSonResult.length-1);
				jSonResult += "]}";

				res.send(jSonResult);
			}else
			{	
				res.send("noValue");
			}
	});
});

function makeRequest(request, callback) {
	var results = [];

	var URIListBase;
	var rangGoogle = 0;
	spotlight.getResources(request, function (spot) {URIListBase = spot});

	google.getResources(request, function (URIListGoogle, titleListGoogle) {
		if(!URIListGoogle || !URIListGoogle.length || !URIListGoogle.length)
			return null;
		var cpt = 0;
		console.log(URIListGoogle);
		URIListGoogle.forEach(function(URIgoogle) {
			alchemy.getResources(URIgoogle, function (content_text) {
				//console.log(URIgoogle);
				//console.log(content_text);
				spotlight.getResources(content_text, function (URIList) {
					console.log(URIgoogle);
					console.log(URIList);
					if(!URIList) {
						_.sortBy(results, function(elem){
							return elem[1];
						});
						callback(results);
						return;
					}
					tout.getJaccard(URIList, URIListBase, function (coeffJacard) {
						console.log(URIgoogle);
						console.log(URIList);
						var resultRankingRow = [];
						resultRankingRow[0] = URIgoogle;
						resultRankingRow[1] = coeffJacard;
						resultRankingRow[2] = URIListGoogle.indexOf(URIgoogle);
						resultRankingRow[3] = titleListGoogle[cpt][0];
						resultRankingRow[4] = titleListGoogle[cpt++][1];

						//console.log(resultRankingRow);
						results.push(resultRankingRow);
						console.log(results.length == URIListGoogle.length - 5);
						if(results.length == URIListGoogle.length - 5) {
							_.sortBy(results, function(elem){
								return elem[1];
							});
							callback(results);
							return;
						}
					});
				});
			});
		});
	});
};


var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('SemanticAwesome listening at http://%s:%s', host, port);

});

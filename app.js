var express = require('express');
var spotlight = require('./spotlightRequest.js');
var alchemy = require('./alchemyRequest.js');
var google = require('./googleRequest.js');
var tout = require('./src/tout.js');
var app = express();

//app.get('/test', function (req, res) {
(function() {
	var requeste = "city of berlin in germany";
	var URIListBase;
	spotlight.getResources(requeste, function (spot) {URIListBase = spot});

	var response = "";
	google.getResources(requeste, function (URIListGoogle) {

		URIListGoogle.forEach(function(URIgoogle) {
			alchemy.getResources(URIgoogle, function (content_text) {
				spotlight.getResources(content_text, function (URIList) {
					tout.getJaccard(URIList, URIListBase, function (coeffJacard) {
						var resultRankingRow = [];
						resultRankingRow[0] = URIgoogle;
						resultRankingRow[1] = coeffJacard;
						
						// mettre resultRankingRow dans un tableau global
						// et sort by coeffJacard
						
						console.log(resultRankingRow);
						});
				});
			});
		});
	});
	console.log("Voila la liste : <br>");
	console.log(response);
})();


var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

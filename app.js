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
	var results = makeRequest(req.query.q);
	console.log(results);
	if(!results.length) {
		results = [
			["http://en.wikipedia.org/wiki/Nice_biscuit", 1, 2, '<b>Nice</b> biscuit - Wikipedia, the free encyclopedia',
			'A <b>nice</b> biscuit is a coconut-flavoured biscuit. It is thin, rectangular in shape, with <br>\nrounded bumps on the edges, and lightly covered with a scattering of large sugar<br>\n&nbsp;...'],
			['http://en.wikipedia.org/wiki/The_Nice', 2, 1, 'The <b>Nice</b> - Wikipedia, the free encyclopedia',
			'The <b>Nice</b> were an English progressive rock band from the 1960s, known for their <br>\nblend of rock, jazz and classical music. Their debut album, The Thoughts of&nbsp;...'],
			['http://en.wikipedia.org/wiki/Nice,_California', 3, 4, '<b>Nice</b>, California - Wikipedia, the free encyclopedia',
			'<b>Nice</b> (formerly Clear Lake Villas) is a census-designated place (CDP) in Lake <br>\nCounty, California, United States. <b>Nice</b> is located 4.5 miles (7.2 km) southeast of&nbsp;...'],
			['http://en.wikipedia.org/wiki/Treaty_of_Nice', 4, 3, 'Treaty of <b>Nice</b> - Wikipedia, the free encyclopedia',
			'The Treaty of <b>Nice</b> was signed by European leaders on 26 February 2001 and <br>\ncame into force on 1 February 2003. It amended the Maastricht Treaty (or the&nbsp;...']
		];
	}
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

app.route('/').get(function(req,res,next){
  res.render('home');
});

app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');
app.use(express.static('public'));

app.route('/autoComplete/:query').get(function(req,res){

	prefix.getResources(req.params.query, function(LabelsList) {

		if(LabelsList.length>0)
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
			console.log("NO RESULTS");
			res.send("{\"Result\" : \"null\" ");
		}

	});
});

function makeRequest(request) {
	var results = [];

	var URIListBase;
	var rangGoogle = 0;
	spotlight.getResources(request, function (spot) {URIListBase = spot});

	google.getResources(request, function (URIListGoogle, titleListGoogle) {
		if(!URIListGoogle || !URIListGoogle.length || !URIListGoogle.length)
			return null;
		var cpt = 0;
		URIListGoogle.forEach(function(URIgoogle) {
			alchemy.getResources(URIgoogle, function (content_text) {
				spotlight.getResources(content_text, function (URIList) {
					tout.getJaccard(URIList, URIListBase, function (coeffJacard) {
						var resultRankingRow = [];
						resultRankingRow[0] = URIgoogle;
						resultRankingRow[1] = coeffJacard;
						resultRankingRow[2] = rangGoogle++;
						resultRankingRow[3] = titleListGoogle[cpt++][0];
						resultRankingRow[4] = titleListGoogle[cpt++][1];

						results.push(resultRankingRow);
					});
				});
			});
		});
	});
	// mettre resultRankingRow dans un tableau global
	// et sort by coeffJacard
	_.sortBy(results, function(elem){
		return elem[1];
	});

	return results;
	//console.log("Voila la liste : <br>");
	//console.log(response);
};


var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

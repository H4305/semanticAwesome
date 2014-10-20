var express = require('express');
var request = require('request');
var app = express();

var text = "Nice is a large city in France on the French Riviera. It's a popular destination for vacationers both young and old, with something to offer nearly everyone. It is well known for the beautiful view on the Promenade des Anglais, its famous waterfront, and is an ethnically diverse port city. ";

app.get('/', function (req, res) {
  requestDBPedia(text, function (body) {
    res.send(body);
  });
});


var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

})

const DBPEDIA_SPOTLIGHT = "http://spotlight.dbpedia.org/rest/candidates";

function requestDBPedia(text, callback) {

  request({
    uri: DBPEDIA_SPOTLIGHT+ "?text="+ encodeURI(text),
    method: "GET",
    timeout: 10000,
    followRedirect: true,
    headers: {
      "Accept": "application/json"
    },
    maxRedirects: 10
  }, function(error, response, body) {
    console.log(error);
    console.log(body);
    callback.call(body);
  });
}
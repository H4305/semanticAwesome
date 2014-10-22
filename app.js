var express = require('express');
var spotlight = require('./spotlightRequest.js');
var app = express();

var text = "Nice is a large city in France on the French Riviera. It's a popular destination for vacationers both young and old, with something to offer nearly everyone. It is well known for the beautiful view on the Promenade des Anglais, its famous waterfront, and is an ethnically diverse port city. ";

// Request routes

app.get('/', function (req, res) {
  spotlight.getResources(text, function (URIList) {
    var response = "";
    URIList.forEach(function(URI) {
      response += URI + "<br>";
    });
    res.send(response);
  });
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
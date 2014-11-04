// Load the http module to create an http server.
var http = require('http');
var fs = require('fs');
var request = require('request');
var _ = require('underscore');
var jaccard = require('jaccard');
//var exec = require('child_process').exe, child;


var jenaserver_url = "localhost";
var jenaserver_port = "3030";
var jenaserver_datastore = "ds";
var jena_data_endpoint = "data";

var dbpedia_filetype = "ntriples";


var subject = [];
var objects = [];

var graphNumber = 0;

var uriListA = [
    "Michelle_Obama",
    // "Thursday_Next",
    // "United_States_Congress",
    // "Student",
    // "Packaging_and_labeling",
    // "Policy",
    "Assistance_dog"];

var uriListB = [
"Presidency_of_Barack_Obama",
// "Sheffield_Wednesday_F.C.",
// "United_States_Congress",
// "Student",
// "University",
// "Packaging_and_labeling",
// "Policy",
"Assistance_dog"
 ];

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(
        function (request, response) {
            response.writeHead(200, {"Content-Type": "text/plain"});
            response.end("server running");
        });




(function() {
    getJaccard(uriListA, uriListB, console.log);    
})();

/*
 * Return the aggregation of all the Ntriples for all the given uri.
 */
function getNtriples(uriList, callback) {
    var uri;
    var total = "";
    var done = 0;
    var set = [];
    //var input = fs.createReadStream('output.txt');
    for(var i=0; i<uriList.length; i++) { 
        uri = uriList[i];   
        getRDF(uri, function(output) {
            set.push(getNtriplesForData(output));
            done++;
            doIfFinished(done==uriList.length-1, function() {
                callback(set);
            });

        });
    }
}


function getJaccard(uriListA, uriListB, callback) {
    var triplesA = [];
    var triplesB = [];
    getNtriples(uriListA, function(array) {
        triplesA = array;
        if(triplesB.length > 0) {
            console.log(triplesA);
            console.log(triplesB);
            callback(jaccard.index(triplesB, triplesA));
        }
        });

    getNtriples(uriListB, function(array) {
        triplesB = array;
        if(triplesA.length > 0) {
            console.log(triplesA);
            console.log(triplesB);
            callback(jaccard.index(triplesB, triplesA));
        }
        });
}

function doIfFinished(condition, func, args) {
    if(condition) {
        func();
    }
}


function getRDF(uri, func) {
    var output = ""; 
    var completeUri  = "http://dbpedia.org/data/" + encodeURI(uri) + "." + dbpedia_filetype;
    //console.log("RDF uri : " + completeUri);
    request(completeUri, function (error, response, body) {
        if (!error ) {
            output += body;
            func(output);
        }
    });
}


function sendRDFData(data, callback) {

    var header = { 
      'content-type': 'text/turtle',
      'accept': '*/*',
      'charset' : 'utf8' };

  var options = {
      host: jenaserver_url,
      port: jenaserver_port,
      path: "/" + jenaserver_datastore + "/" + jena_data_endpoint + "?default",
      method: 'PUT',
      headers: header
    };

    var req = http.request(options, function(res) {
      console.log('STATUS: ' + res.statusCode);
      console.log('HEADERS: ' + JSON.stringify(res.headers));
      res.setEncoding('utf8');
      res.on('data', callback);
      /*res.on('data', function (chunk) {
        //console.log('BODY: ' + chunk);
      });*/
    });

    //console.log('Request URL : ' + options.path);

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });

    // write data to request body
    req.write(data);

    req.end();
}


function getUniqSubjectUri(data) {
    var results = new Array([]);;
    _.each(data.split('\n'), function(element, index, list) {
        results.push(element.split(new RegExp("[\\n\\t\\s]+")).filter(Boolean)[0]);
    });
    return results;
}

function getNtriplesForData(data) {
    var result = new Array([]);
    _.each(data.split('\n'), function(element, index, list) {
        //console.log(element);
        var array = element.match(/"[^"]*"[^\s\n\t]+|[^\s"]+/g);
        console.log(array);
        if(array != null && array[2][0] != '"') {
            result.push(array[0] + " " + array[1] + " " + array[2]);
        }
    });
    return result;
}


function readLines(input, func) {
    var remaining = '';

    input.on('data', function(data) {
        remaining += data;
        var index = remaining.indexOf('\n');
        var last  = 0;
        while (index > -1) {
            var line = remaining.substring(last, index);
            last = index + 1;
            console.log("Line : " + line);
            func(line);
            index = remaining.indexOf('\n', last);
        }

        remaining = remaining.substring(last);
    });

    input.on('end', function() {
        if (remaining.length > 0) {
            func(remaining);
        }
    });
}

function sparqlQuery(query) {

}

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(8000);

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:8000/");

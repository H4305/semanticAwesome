// Load the http module to create an http server.
var http = require('http');
var fs = require('fs');
var request = require('request');

var uriList = [
    "Michelle_Obama",
    "Thursday_Next",
    "United_States_Congress",
    "Student",
    "Packaging_and_labeling",
    "Policy",
    "Assistance_dog"];

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(
        function (request, response) {
            response.writeHead(200, {"Content-Type": "text/plain"});
            response.end("server running");
        });


(function() {
    var input = fs.createReadStream('output.txt');
    for(var uri in uriList) {    
        getRDF(uri, function(output) {
                    console.log(output);
            });
    }
})();


function getRDF(uri, func) {
    var output = "";
    var completeUri  = "http://dbpedia.org/data/" + encodeURI(uri) + ".n3";
    console.log("RDF uri : " + completeUri);
    request(completeUri, function (error, response, body) {
        console.log(error);
        if (!error ) {
            output += body;
            func(output);
        }
    });
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

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(8000);

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:8000/");

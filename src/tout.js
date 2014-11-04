var http = require('http');
var fs = require('fs');
var request = require('request');
var _ = require('underscore');
var jaccard = require('jaccard');

var jenaserver_url = "localhost";
var jenaserver_port = "3030";
var jenaserver_datastore = "ds";
var jena_data_endpoint = "data";

var dbpedia_filetype = "ntriples";


var uriListA = [
    "Michelle_Obama",
    "Thursday_Next",
    "United_States_Congress",
    "Student",
    "Packaging_and_labeling",
    "Policy",
    "Assistance_dog"];

var uriListB = [
"Presidency_of_Barack_Obama",
 "Sheffield_Wednesday_F.C.",
 "United_States_Congress",
 "Student",
 "University",
 "Packaging_and_labeling",
 "Policy",
"Assistance_dog"
 ];

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(
    function (request, response) {
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.end("server running");
    });

var setTriplesA = [];
var setTriplesB = [];

module.exports = (function() {
    
    return {
        getJaccard : function getJaccard(uriListA, uriListB, callback) {
            
            getNtriples(uriListA, function (list){
                            setTriplesA = list;   
                            if(setTriplesB.length > 0) {     
                                console.log(setTriplesB.length);
                                console.log("-----------------------------------------------------");
                                console.log(setTriplesA.length);        
                                callback(jaccard.index(setTriplesA, setTriplesB));
                            }
            }); 
            getNtriples(uriListB, function (list){
                            setTriplesB = list;   
                            if(setTriplesA.length > 0) {
                                console.log(setTriplesB.length);
                                console.log("-----------------------------------------------------");
                                console.log(setTriplesA.length);   
                                callback(jaccard.index(setTriplesA, setTriplesB));
                            }             
            }); 
        }
    }
})();



/*
 * Return the aggregation of all the Ntriples for all the given uri.
 */
function getNtriples(uriList, callback) {
    var uri;
    var total = "";
    var done = 0;
    var set = [];
    var output;
    var listTriplesforOneUri;
    //var input = fs.createReadStream('output.txt');
    for(var i=0; i<uriList.length; i++) { 
        
        uri = uriList[i];   
        getRDF(uri, function(output) {
            set = set.concat(getNtriplesForData(output));
            //console.log("SET : " + set);
            done++;
            doIfFinished(done==uriList.length-1, function() {
                callback(set);
            });
        });
    };
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

function getNtriplesForData(data) {
    var result = [];
    var triplet;
    _.each(data.split('\n'), function(element, index, list) {
        var array = element.match(/"[^"]*"[^\s\n\t]+|[^\s"]+/g);
        if(array != null && array[2][0] != '"') {
            triplet = array[0] + " " + array[1] + " " + array[2]; 
            result.push(triplet);
        }
    });
    return result;
}



// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(8000);

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:8000/");

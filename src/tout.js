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

var setTriplesA = [];
var setTriplesB = [];

module.exports = (function() {
    
    return {
        getJaccard : function getJaccard(uriListA, uriListB, callback) {
            var Aready = false,
                Bready = false;
            getNtriples(uriListA, function (list){
                            setTriplesA = list;   
                            if(setTriplesB.length > 0) {     
                                /*console.log(setTriplesB.length);
                                console.log("-----------------------------------------------------");
                                console.log(setTriplesA.length); */       
                                if(Bready == true)
                                    callback(jaccard.index(setTriplesA, setTriplesB));
                                Aready = true;
                            }
            }); 
            getNtriples(uriListB, function (list){
                            setTriplesB = list;   
                            if(setTriplesA.length > 0) {
                                /*console.log(setTriplesB.length);
                                console.log("-----------------------------------------------------");
                                console.log(setTriplesA.length); */  
                                if(Aready == true)
                                    callback(jaccard.index(setTriplesA, setTriplesB));
                                Bready = true;
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

var dbpedia = require('./dbpediaNtriples');
var jaccard = require('jaccard');


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


(function() {
	console.log(getJaccard(uriListA, uriListB));    
})();



function getJaccard(uriListA, uriListB) {
	return jaccard.index(
		dbpedia.getNtriples(uriListA),
		dbpedia.getNtriples(uriListB)
	);
}
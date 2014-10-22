# Creation du graph RDF


Une fois le fichier récuperé depuis dbpedia, on lance une requete par 
JENA du type : 

<code>
SELECT ?s, ?p, ?o
WHERE {
 ?s ?p ?o.
 ?s in (L).
 ?o in (L).
}
</code>

Cette requete va nous donner une liste de triplets non connexes.
Pour les connecter, on va faire une deuxième requete SPARQL :

<code>
SELECT ?s, ?p, ?o
WHERE { 
 ?s ?p ?o. 
 ?s in (R). 
}
</code>

Une fois le graph récuperé, il faut trouver ses similitudes avec les autres
graphs des autres résultats.

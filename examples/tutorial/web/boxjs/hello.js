console.log("-- 1. hello.js ----------------------------------------------------");
var response = global.response;

print("io: " + io);

print("http: " + http);

/*
var msg = " xxx ", x = {nome: "Pedro Paulo", idade: 8, cidade: "Uberlandia"};

response.write("<html> <head><title>abc</title></head> <body> <h1> Hello at "
    + new Date() + " from " + global.request.absoluteUri 
    + " </h1> <hr>" + JSON.stringify(x) + "<br>" + "<hr> </body> </html>");


var r = require("actions.js");

print("function exports.geral: " + r.geral);

exports.exptest = "Exports Test!";
*/

//var window = {};
/*
var jsrender = require("modules/jsrender.js");
print("jsrender(templates): " + jsrender.$templates);

var stmp = "<li>\r\n\t{{>name}} {{>releaseYear}}\r\n</li>";
var movies = [
    { name: "Up", releaseYear: "2009", languages: [{ name: "English" }, { name: "Spanish" }] },
    { name: "Finding Nemo", releaseYear: "2003", languages: [] },
    { name: "Toy Story", releaseYear: "1995", languages: [{ name: "English" }, { name: "German" }] }
];
//jsrender.$views.templates({
jsrender.$templates({
	testTemplate: stmp
});
response.write('<ul id="movieList" >' + jsrender.$render.testTemplate( movies ) + '</ul>');
var data= {altLogo: "boxJS", srcLogo: "img/boxJS.png"};
stmp = '<a href="http://www.xeround.com/">\r\n\t<img alt="{{>altLogo}}" src="{{>srcLogo}}">\r\n</a>';
jsrender.$templates({
	testTemplate: stmp
});
response.write('<hr/><script type="text/javascript">alert(\'xxx ' + jsrender.$render.testTemplate( data ).toString().replace("\r\n", "") + '\');</script>');
*/

/*
var Mongo = JavaImporter(com.mongodb).Mongo;
var BSON = JavaImporter(com.mongodb.rhino).BSON;

MJSON = JavaImporter(com.threecrickets.rhino).JSON;
MJSON.implementation = new Packages.com.mongodb.rhino.MongoJsonImplementation();

var connection = new Mongo()
var db = connection.getDB('test')
var collection = db.getCollection('test')

//var doc = {name: 'hello'}
//collection.insert(BSON.to(doc))
//collection.insert(BSON.to({name: "helio"}))
//collection.insert(BSON.to({name: "helena"}))
//collection.insert(BSON.to({name: "pedro"}))

var query = {name: 'hello'}
var update = {$push: {anArray: 'aValue'}}
collection.update(BSON.to(query), BSON.to(update), false, false)

var query = {name: /he(.*)/i}
//var doc = BSON.from(collection.findOne(BSON.to(query)))
var doc = BSON.from(collection.find(BSON.to(query)).toArray())
java.lang.System.out.println(MJSON.to(doc))
*/

print("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -")

/*
var MongoDB = require("trd-part/mongo-db.js").MongoDB;
var BSON = MongoDB.BSON;

var connection = MongoDB.connect("localhost:27017")
var db = connection.getDB('test')
var collTest = new MongoDB.Collection("test", {connection: connection, db: db});

var query = {name: /hele(.*)/i}
print(JSON.stringify(collTest.find(query).toArray()))
*/

/*
var MongoDB = require("trd-part/mongodb.js").MongoDB;

MongoDB.connect("localhost:27017")
MongoDB.db('test')
var collTest = new MongoDB.Collection("test");
var usuarios = new MongoDB.Collection("usuarios");

var query = {name: /hele(.*)/i}
print(JSON.stringify(collTest.find(query).toArray()));

print(JSON.stringify(
    usuarios.aggregate( {$match: {empresa: 1}}, {$group: {_id: "$_id", total: {$sum: 1}}} ).result.result
));


exports.echo = function(params, req, res) {
    var p = (params)? JSON.stringify(params) : "[]";
    response.write("<html> <head><title>abc</title></head> <body> <h1> Echo Function"
        + " </h1> <hr>" + "[ECHO]" + "<br>params: " + p + "<br><hr> </body> </html>");    
}
*/
console.log("-- 2. hello.js ----------------------------------------------------");

[1,2,3].forEach(function(x){ console.log(x+"..."); });

http.response.write("<html><body> <h1>Hello boxJS!!</h1> </body></html>");

var BasicDBObject = Java.type('com.mongodb.BasicDBObject');
var HashMap = Java.type('java.util.HashMap');

// To directly connect to a single MongoDB server (note that this will not auto-discover the primary even
// if it's a member of a replica set:
var mongoClient = new com.mongodb.MongoClient( "localhost" , 27017 );

var db = mongoClient.getDB( "test" );

var emp, emps = db.getCollection("empresas");

print(emps);

//var doc = new BasicDBObject("nome", "Rocavin")
//        .append("razaoSocial", "Rocavin")
//        .append("colaboradores", 45)
//        .append("info", new BasicDBObject("x", 205).append("y", 132));

//var emp = new BasicDBObject().putAll({nome: "Rocavin", razaoSocial: "Rocavin"});
(emp = new BasicDBObject()).putAll({nome: "SBX BH", razaoSocial: "SBX", infos:{colaboradores: 45, codigo: "xpta"}});
//emp.putAll({nome: "SBX", razaoSocial: "SBX", infos:{colaboradores: 45, codigo: "xpta"}});

print(emp);

emps.insert(emp);

//var jmap = Java.to({nome: "Rocavin", razaoSocial: "Rocavin"}, "java.util.HashMap<String,Object>");



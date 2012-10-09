var response = global.response;
var msg = " xxx ", x = {nome: "Pedro Paulo", idade: 8, cidade: "Uberlandia"};

response.write("<html> <head><title>abc</title></head> <body> ");
response.write("<h1> Hello at "
    + new Date() + " from " + global.request.getServletPath() 
    + " </h1> <hr>" + JSON.stringify(x) + "<br>");

var r = require("actions.js");
//var r = load("actions.js");

print("function exports.geral: " + r.geral);
response.write("<br>function exports.geral: <br><pre>" + r.geral + "</pre>");

print("function actions.xxx: " + r.actions.test);
response.write("<br><strong>function actions.xxx: </strong><pre>" + r.actions.test + "</pre>");


exports.exptest = "Exports Test!";
